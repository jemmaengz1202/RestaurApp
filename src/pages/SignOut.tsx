import React, { useContext } from 'react';
import { GeneralContext } from '../contexts/GeneralContext';
import { axiosInstance } from '../api';
import { useHistory } from 'react-router';

export default function SignOut() {
  const { signOut, openSnackbar } = useContext(GeneralContext);
  const history = useHistory();
  const logOut = async () => {
    try {
      const response = await axiosInstance.request({
        url: '/usuarios/logout',
        method: 'POST',
      });
      if (response.status === 204) {
        signOut();
        history.replace('/signin');
        openSnackbar('Se ha cerrado la sesión', 'info');
      }
    } catch (err) {
      if (err.response.status !== 401) {
        openSnackbar('Error al intentar cerrar la sesión', 'error');
      }
    }
  };

  logOut();

  return <></>;
};