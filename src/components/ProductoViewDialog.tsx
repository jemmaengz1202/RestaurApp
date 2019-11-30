import React from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import useAxios from '@use-hooks/axios';
import { axiosInstance } from '../api';
import { Grid, Divider, Card } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
    },
    link: {
      textDecoration: 'none', 
      color: 'white',
    },
    textMargin: {
      marginTop: theme.spacing(1),
    }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

type ProductoViewDialogProps = {
  idProducto: number,
  open: boolean,
  handleClose: () => void,
};

export default function ProductoViewDialog({ idProducto, open, handleClose }: ProductoViewDialogProps) {
  const classes = useStyles();
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/productos/${idProducto}?filter[include][categoria]`,
    method: "GET",
    trigger: []
  });

  const producto = response ? response.data : null;
  if (loading || producto == null) return null;

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link
                to="/productos"
                className={classes.link}
                onClick={handleClose}
              >
                Todos los productos
              </Link>
            </Typography>
            <Typography variant="h6" className={classes.title}>
              /
            </Typography>
            <Typography variant="h6" className={classes.title}>
              <Link
                to={`/productos/categoria/${producto.categoriaId}`}
                className={classes.link}
                onClick={handleClose}
              >
                {producto.categoria ? producto.categoria.nombre : ""}
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          justify="center"
          style={{ padding: 32, minHeight: "90vh" }}
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <ReactImageMagnify
              smallImage={{
                alt: "Imagen del producto",
                isFluidWidth: true,
                src: producto.imagenUrl
              }}
              largeImage={{
                alt: "Imagen del producto",
                src: producto.imagenUrl,
                width: 1000,
                height: 800
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={{ padding: 32 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h3">{producto.nombre}</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item className={classes.textMargin}>
                      {producto.categoria && (
                        <Link
                          style={{
                            marginRight: 16,
                            textDecoration: "none",
                            color: "white"
                          }}
                          to={`/productos/categoria/${producto.categoriaId}`}
                        >
                          <i>{producto.categoria.nombre}</i>
                        </Link>
                      )}
                    </Grid>
                    <Grid item className={classes.textMargin}>
                      <Typography variant="button">
                        Id: {producto.id}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="body2" className={classes.textMargin}>
                    {producto.descripcion}
                  </Typography>
                  <Typography variant="h4" className={classes.textMargin}>
                    <b>Precio:</b> ${producto.precio}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
