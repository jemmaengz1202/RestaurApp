import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";
import Background from "../img/restaurant.jpg";
import Usuario from "../types/usuario";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Restaurante
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
    },
    image: {
      backgroundImage: `url(${Background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

export default function SignIn() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recordarmeChecked, setRecordarmeChecked] = useState(false);
  const { changeTitle, openSnackbar, signIn } = useContext(GeneralContext);
  const history = useHistory();

  useEffect(() => {
    changeTitle("Acceder");
  }, [changeTitle]);

  const handleRecordarmeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    setRecordarmeChecked((v) => !v);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = recordarmeChecked
      ? { username, password, ttl: 100000000 }
      : { username, password };

    try {
      const responseLogin = await axiosInstance({
        url: "usuarios/login",
        method: "POST",
        data,
      });
      if (responseLogin.status === 200) {
        const responseUsuario = await axiosInstance.request<Usuario>({
          url: "usuarios/whoami",
          method: "GET",
        });
        if (responseUsuario.status === 200) {
          signIn(responseUsuario.data);
          openSnackbar("Autenticado correctamente");
          history.replace("/");
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        openSnackbar("Usuario o contraseña incorrectos", "error");
      }
    }
  };

  const handleOnUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handleOnPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresar
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleOnUsernameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleOnPasswordChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={recordarmeChecked}
                  onChange={handleRecordarmeChecked}
                  value="remember"
                  color="primary"
                />
              }
              label="Recordarme"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!username || !password}
            >
              Ingresar
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
