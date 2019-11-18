import React, { useEffect, useContext } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@storybook/theming';
import Background from '../img/wallpaper.jpg';
import { Grid, Typography, Button } from '@material-ui/core';
import { GeneralContext } from '../contexts/GeneralContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hero: {
      position: 'relative',
      height: '90vh',
      '&::before': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${Background}) `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(50%)'
      }
    },
    heroContent: {
      position: 'relative'
    },
    titleText: {
      padding: theme.spacing(2),
    },
    buttonContainer: {
      padding: theme.spacing(8),
    },
  })
);

export default function Index() {
  const classes = useStyles();
  const { changeTitle } = useContext(GeneralContext);

  useEffect(() => {
    changeTitle('RestaurApp')
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
            <Typography variant="h2" align="center">
              RESTAURAPP
            </Typography>
          </Grid>
          <Grid item className={classes.titleText}>
            <Typography variant="subtitle1" align="center">
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
                  <Button variant="contained" color="secondary">
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