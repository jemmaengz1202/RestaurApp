import React, { ReactNode } from 'react';
import { Theme, CssBaseline } from '@material-ui/core';
import { darkTheme } from '../themes';
import { ThemeProvider } from '@material-ui/styles';

type withThemeProps = {
  children: ReactNode,
  theme?: Theme
};

const WithTheme = ({ children, theme = darkTheme }: withThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default WithTheme;