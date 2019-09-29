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

type Props = Omit<TextFieldProps, 'error'> & WithStyles<typeof styles> & {
  error?: string,
};

export default withStyles(styles)((props: Props) => {
  const { classes, error, variant, ...other } = props;
  return <TextField inputProps={{ className: classes.input }} error={!!error} helperText={error} variant={variant as any} {...other} />;
});