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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
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
    url: `/productos/${idProducto}`,
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
              {producto.nombre}
            </Typography>
          </Toolbar>
        </AppBar>
        <div>

        </div>
      </Dialog>
    </div>
  );
}
