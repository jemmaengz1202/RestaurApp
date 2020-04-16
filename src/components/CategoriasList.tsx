import { Grid } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useAxios from "@use-hooks/axios";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      position: "relative",
      height: 200,
      "&:hover, &$focusVisible": {
        zIndex: 1,
        "& $imageBackdrop": {
          opacity: 0.15,
        },
        "& $imageMarked": {
          opacity: 0,
        },
      },
    },
    imageButton: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
    },
    imageBackdrop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0.4,
      transition: theme.transitions.create("opacity"),
    },
  })
);

export default function ButtonBases() {
  const classes = useStyles();
  const { search } = useContext(GeneralContext);
  const history = useHistory();
  const { response } = useAxios({
    axios: axiosInstance,
    url: `/categorias?filter[where][q]=${encodeURIComponent(
      search ? search : ""
    )}`,
    method: "GET",
    trigger: [search],
  });

  const images = response
    ? response.data.map((el: any) => ({
        id: el.id,
        url: el.imagenUrl,
        title: el.nombre,
      }))
    : [];

  const handleCategoriaClick = (id: number) => {
    history.push(`/productos/categoria/${id}`);
  };

  return (
    <Grid container>
      {images.map((image: any, index: number) => (
        <Grid item xs={12} sm={4} md={4} key={index}>
          <ButtonBase
            focusRipple
            className={classes.image}
            style={{ width: "100%" }}
            onClick={(_) => handleCategoriaClick(image.id)}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            ></span>
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography component="span" variant="subtitle1" color="inherit">
                {image.title}
              </Typography>
            </span>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
}
