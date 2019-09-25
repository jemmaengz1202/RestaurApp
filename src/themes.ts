import { createMuiTheme } from "@material-ui/core";
import { teal, pink } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: pink
  }
});
