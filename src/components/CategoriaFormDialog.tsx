import React, { useState, ChangeEvent, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { axiosInstance } from '../api';
import { GeneralContext } from '../contexts/GeneralContext';

type CategoriaFormDialogProps = {
  open: boolean,
  onClose: () => void,
};

export default function CategoriaFormDialog({ open, onClose }: CategoriaFormDialogProps) {
  const [nombre, setNombre] = useState('');

  const { openSnackbar } = useContext(GeneralContext);

  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleAddCategoriaClick = async () => {
    const res = await axiosInstance({
      url: "/categorias",
      method: "POST",
      data: {
        nombre,
      }
    });
    if (res) {
      openSnackbar('Categoría añadida correctamente', 'success');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>Añadir categoría</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombreCategoria"
          label="Nombre de la categoría"
          fullWidth
          onChange={handleNombreChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleAddCategoriaClick}
          color="primary"
          disabled={!nombre}
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
