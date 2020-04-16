import { Button, Grid, Typography } from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme } from "@storybook/theming";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GeneralContext } from "../contexts/GeneralContext";
import Background from "../img/wallpaper.jpg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hero: {
      position: "relative",
      height: "90vh",
      [theme.breakpoints.down("sm")]: {
        height: "93.2vh",
      },
      "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${Background}) `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(35%)",
      },
    },
    heroContent: {
      position: "relative",
    },
    titleText: {
      padding: theme.spacing(1),
    },
    buttonContainer: {
      padding: theme.spacing(4),
    },
    light: {
      fontWeight: 600,
    },
  })
);

export default function Index() {
  const classes = useStyles();
  const { changeTitle } = useContext(GeneralContext);

  useEffect(() => {
    changeTitle("RestaurApp");
  }, [changeTitle]);

  return (
    <Grid
      container
      className={classes.hero}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item className={classes.heroContent}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h1" align="center">
              <RestaurantIcon
                fontSize="large"
                style={{ transform: "scale(2)" }}
              />
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center">
              <i>Bienvenidos a</i>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2" align="center">
              <span>RESTAUR</span>
              <b className={classes.light}>APP</b>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" align="center">
              🟊🟊🟊🟊🟊
            </Typography>
          </Grid>
          <Grid item className={classes.titleText}>
            <Typography variant="h6" align="center">
              Restaurante de cocina internacional con especialidad en carnes y
              ensaladas
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              justify="center"
              className={classes.buttonContainer}
            >
              <Grid item>
                <Link to="/productos">
                  <Button variant="outlined" color="default">
                    Ver nuestros productos
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
