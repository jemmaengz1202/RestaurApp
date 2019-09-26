import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: red
  }
});

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: teal,
    secondary: red
  }
});
