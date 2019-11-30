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
import missingImage from '../img/missing.jpg';

const useStyles = makeStyles({
  card: {
    width: 345,
    marginBottom: 20,
    height: 320
  },
  media: {
    height: 140
  }
});

type ProductoCardProps = {
  producto: any,
  handleClick: (id: number) => void,
};

export default function ProductoCard({ producto, handleClick }: ProductoCardProps) {
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
    history.push(`/productos/categoria/${producto.categoriaId}`)
  };

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleProductoClick}>
        <CardMedia
          className={classes.media}
          image={producto.imagenUrl ? producto.imagenUrl : missingImage}
          title={producto.nombre}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {producto.nombre}: ${producto.precio}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {producto.descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handleProductoClick}>
          Ver detalles
        </Button>
        { producto.categoria && (
          <Button size="small" color="primary" onClick={handleCategoriaClick}>
            Ver más {producto.categoria.nombre}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
