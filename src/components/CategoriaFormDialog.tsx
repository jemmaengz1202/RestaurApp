import React, { useState, ChangeEvent, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { axiosInstance, uploadImage } from '../api';
import { GeneralContext } from '../contexts/GeneralContext';
import UploadImageButton from './UploadImageButton';
import Categoria from '../types/categoria';
import useAxios from '@use-hooks/axios';

type CategoriaFormDialogProps = {
  open: boolean,
  onClose: () => void,
  categoria: Partial<Categoria>,
  title: string,
};

export default function CategoriaFormDialog(props: CategoriaFormDialogProps) {
  const categoria = props.categoria;
  const [nombre, setNombre] = useState(categoria.nombre ? categoria.nombre : '');
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState(
    categoria.imagenUrl ? categoria.imagenUrl : ""
  );
  const [imagenFormData, setImagenFormData] = useState<FormData | null>(null);

  const { openSnackbar } = useContext(GeneralContext);

  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleCategoriaImageChange = (url: string, data: FormData) => {
    setImagenPreviewUrl(url);
    setImagenFormData(data);
  };

  const handleAddCategoriaClick = async () => {
    let imagenUrl = '';
    if (imagenFormData) {
      imagenUrl = await uploadImage(imagenFormData);
    }
    const res = await axiosInstance({
      url: props.categoria.id ? `/categorias/${props.categoria.id}` : "/categorias",
      method: props.categoria.id ? "PATCH" : "POST",
      data: {
        nombre,
        imagenUrl,
      }
    });
    if (res) {
      console.log(res);
      openSnackbar('Categoría guardada correctamente', 'success');
      props.onClose();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>{props.title ? props.title : 'Añadir categoría'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombreCategoria"
          label="Nombre de la categoría"
          fullWidth
          onChange={handleNombreChange}
          value={nombre}
        />
        <br />
        <UploadImageButton
          imagePreviewUrl={imagenPreviewUrl}
          buttonText={"Imagen"}
          onChange={handleCategoriaImageChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button
          onClick={handleAddCategoriaClick}
          color="primary"
          disabled={!nombre}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CategoriaFormDialog.defaultProps = {
  categoria: {},
} as Partial<CategoriaFormDialogProps>;

type EditCategoriaFormDialogProps = {
  id: number,
  open: boolean,
  onClose: () => void,
};

export function EditCategoriaFormDialog({
  id,
  open,
  onClose
}: EditCategoriaFormDialogProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/categorias/${id}`,
    method: "GET",
    trigger: []
  });

  const categoria = response ? response.data : null;

  if (loading || categoria == null) return null;

  return (
    <CategoriaFormDialog
      categoria={categoria}
      title="Editar usuario"
      open={open}
      onClose={onClose}
    />
  );
}
