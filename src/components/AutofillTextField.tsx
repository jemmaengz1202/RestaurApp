import { createStyles, withStyles} from '@material-ui/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import React from 'react';
import { WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';


const styles = (theme: Theme) => {
  const styles = createStyles({
    input: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
        WebkitTextFillColor: theme.palette.text.primary
      }
    }
  });
  return styles;
};

interface Props extends WithStyles<typeof styles> {};

export default withStyles(styles)((props: Props & TextFieldProps) => {
  const { classes, ...other } = props;
  console.log(props); 
  return <TextField inputProps={{ className: classes.input }} {...other} />;
});