import React, { SyntheticEvent, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import CustomizedSBContent from './CustomizedSBContent';

type CustomizedSnackbarProps = {
  open: boolean,
  handleClose: () => void,
  variant?: 'success' | 'warning' | 'error' | 'info',
  message: string,
};

export default function({ open, handleClose, variant = 'success', message }: CustomizedSnackbarProps) {

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <CustomizedSBContent
        onClose={handleClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};