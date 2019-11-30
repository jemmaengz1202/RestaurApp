import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import missingImage from "../img/missing.jpg";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    width: 330,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
    height: 320
  },
  media: {
    height: 140
  },
  content: {
    height: 320 - 186
  }
});

type ProductoCardProps = {
  producto: any;
  handleClick: (id: number) => void;
};

const DESCRIPCION_MAX_LENGTH = 137;

export default function ProductoCard({
  producto,
  handleClick
}: ProductoCardProps) {
  const classes = useStyles();
  const history = useHistory();

  const handleProductoClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleClick(producto.id);
  };

  const handleCategoriaClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    history.push(`/productos/categoria/${producto.categoriaId}`);
  };

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleProductoClick}>
        <CardMedia
          className={classes.media}
          image={producto.imagenUrl ? producto.imagenUrl : missingImage}
          title={producto.nombre}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2">
            {producto.nombre}: ${producto.precio}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {producto.descripcion.length > DESCRIPCION_MAX_LENGTH ? (
              <>{`${producto.descripcion.substring(0, DESCRIPCION_MAX_LENGTH)}...`}</>
            ) : (
              <>{producto.descripcion}</>
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container justify="space-between">
        <Button
          size="small"
          color="default"
          onClick={handleProductoClick}
          variant="outlined"
        >
          Ver detalles
        </Button>
        {producto.categoria && (
          <Button
            size="small"
            color="default"
            onClick={handleCategoriaClick}
            variant="outlined"
          >
            más {producto.categoria.nombre}
          </Button>
        )}
        </Grid>
      </CardActions>
    </Card>
  );
}
