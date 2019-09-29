import { createMuiTheme } from "@material-ui/core";
import { teal, red,  } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: red
  },
  overrides: {
    MuiInputBase: {
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px #484848 inset`,
          WebkitTextFillColor: 'white'
        }
      }
    }
  }
});

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: teal,
    secondary: red
  },
  overrides: {
    MuiInputBase: {
      input : {
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px #FAFAFA inset`,
          WebkitTextFillColor: '#202020'
        }
      }
    }
  },
});
