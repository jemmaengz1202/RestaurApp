import { Button, createStyles, Grid, InputAdornment, MenuItem, Paper, Theme, Dialog, DialogTitle, DialogActions, DialogContent, TextField as MTextField } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { makeStyles } from '@material-ui/styles';
import useAxios from '@use-hooks/axios';
import { Field, Form, Formik, FormikActions } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import { API_URL, axiosInstance } from '../api';
import { productoSchema } from '../schemas/Producto.schema';
import Categoria from '../types/categoria';
import Producto from '../types/producto';
import CustomizedSnackbar from './CustomizedSnackbar';

type ProductoFormProps = {
  producto: Partial<Producto>
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonUpload: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    buttonSubmit: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    image: {
      maxWidth: '100%',
      marginBottom: theme.spacing(2)
    },
    mainGrid: {
      maxWidth: '100%',
    }
  })
);

export function ProductoForm(props: ProductoFormProps)  {
  const classes = useStyles();

  const [producto, setProducto] = useState(props.producto);

  const [isValidImageEdit, setIsValidImageEdit] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | ArrayBuffer | null>(producto.imagenUrl ? producto.imagenUrl : null);
  const [imageFormData, setImageFormData] = useState<FormData | null>(null);

  const { response, reFetch } = useAxios({
    axios: axiosInstance,
    url: '/categorias',
    method: 'GET',
    trigger: [],
  });
  const listaCategorias: Array<Categoria> = response ? response.data : [];

  console.log(listaCategorias);

  const [openSnack, setOpenSnack] = useState(false);

  const [openCategoriaDialog, setOpenCategoriaDialog] = useState(false);

  const [nombreCategoria, setNombreCategoria] = useState('');

  const handleCategoriaDialogClose = () => {
    setOpenCategoriaDialog(false);
  };

  const handleNombreCategoriaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombreCategoria(e.target.value);
  };

  const handleAddCategoriaClick = async () => {
    const res = await axiosInstance({
      url: '/categorias',
      method: 'POST',
      data: {
        nombre: nombreCategoria,
      },
    });
    if (res) {
      setOpenCategoriaDialog(false);
      reFetch();
    }
  };

  const handleImageChange = async (e: any, formIsValid: boolean) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length > 0) {
      const image = files[0];
      const formData = new FormData();
      formData.append('file', image);

      // Para la previsualización de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(image);

      setImageFormData(formData);

      if (formIsValid) {
        setIsValidImageEdit(true);
      }
    }
  };

  const handlePrecioFocus = (e: any) => {
    e.target.select();
  };

  const handleSnackClose = (event?: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const onSubmit = async (values: Partial<Producto>, { setSubmitting, resetForm }: FormikActions<Partial<Producto>>) => {
    let imagenUrl;
    if (imageFormData) {
      try {
        const res = await axiosInstance({
          url: '/attachments/images/upload',
          method: 'POST',
          data: imageFormData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const imageName = res.data.result.files.file[0].name;
        imagenUrl = `${API_URL}/attachments/images/download/${imageName}`;
      } catch (err) {
        console.log('Error al subir la imagen: ', err);
      }
    }
    const productoBody = { ...values, imagenUrl };
    const res = await axiosInstance({
      url: (producto.id ? `/productos/${producto.id}`: '/productos'),
      method: (producto.id ? 'PATCH': 'POST'),
      data: productoBody,
    });
    setSubmitting(false);
    if (res) {
      console.log('Todo OK: ', res);
      setOpenSnack(true);
      setImagePreviewUrl(null);
    }
    if (producto.imagenUrl) {
      setImagePreviewUrl(producto.imagenUrl);
      setProducto(values);
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={producto}
      validationSchema={productoSchema}
      onSubmit={onSubmit}
      render={({ submitForm, isSubmitting, isValid, values }) => (
        <Grid
          className={classes.mainGrid}
          container
          spacing={3}
          justify="center"
          component="div"
        >
          <Grid item xs={8} component={Paper}>
            <Form>
              <Field
                name="nombre"
                type="text"
                label="Nombre"
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <br />
              <Field
                name="precio"
                type="number"
                label="Precio"
                component={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                onFocus={handlePrecioFocus}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
              <br />
              <Field
                name="descripcion"
                type="text"
                label="Descripción"
                component={TextField}
                variant="outlined"
                multiline
                margin="normal"
                fullWidth
                rowsMax="5"
              />
              <br />
              <Grid container alignItems="center">
                <Grid item xs={12} sm={11}>
                  <Field
                    name="categoriaId"
                    type="text"
                    label="Categoría"
                    margin="normal"
                    fullWidth
                    component={TextField}
                    select
                    InputLabelProps={{
                      shrink: true
                    }}
                    helperText={!producto.id ? 'Campo requerido' : null}
                  >
                    {listaCategorias.map(categoria => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button variant="contained" color="primary" fullWidth onClick={() => setOpenCategoriaDialog(true)}>
                    +
                  </Button>
                </Grid>
              </Grid>
              <br />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={e => handleImageChange(e, values == producto)}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  id="raised-button-file"
                  color="secondary"
                  startIcon={<ImageIcon />}
                  component="span"
                  className={classes.buttonUpload}
                >
                  {imagePreviewUrl || producto.imagenUrl
                    ? 'Cambiar imagen'
                    : 'Subir imagen'}
                </Button>
              </label>
              <br />
              {imagePreviewUrl && (
                <img
                  className={classes.image}
                  src={imagePreviewUrl as any}
                  alt="Imagen del producto"
                />
              )}
              {!imagePreviewUrl && <p>No hay imagen guardada.</p>}
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting || (!isValid && !isValidImageEdit)}
                onClick={submitForm}
                fullWidth
              >
                {producto.id ? 'Guardar cambios' : 'Guardar'}
              </Button>
            </Form>
            <CustomizedSnackbar
              open={openSnack}
              message="Operación exitosa."
              handleClose={handleSnackClose}
            />
            <Dialog
              open={openCategoriaDialog}
              onClose={handleCategoriaDialogClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Añadir categoría</DialogTitle>
              <DialogContent>
                <MTextField
                  autoFocus
                  margin="dense"
                  id="nombreCategoria"
                  label="Nombre de la categoría"
                  fullWidth
                  onChange={handleNombreCategoriaChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCategoriaDialogClose}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCategoriaClick} color="primary" disabled={!nombreCategoria}>
                  Añadir
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      )}
    />
  );
};

ProductoForm.defaultProps = {
  producto: {},
} as Partial<ProductoFormProps>;

type EditProductoFormProps = {
  id: number
}

export function EditProductoForm({ id }: EditProductoFormProps) {
  const {response, loading} = useAxios({
    axios: axiosInstance,
    url: `/productos/${id}`,
    method: 'GET',
    trigger: [],
  });

  const producto = response ? response.data : null; 

  if (loading || producto == null) return <>Cargando</>;

  return <ProductoForm producto={ producto } />;

};