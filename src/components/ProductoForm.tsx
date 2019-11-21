import {
  Button,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { Field, Form, Formik, FormikActions } from "formik";
import { TextField } from "formik-material-ui";
import React, { useState, useContext } from "react";
import { API_URL, axiosInstance } from "../api";
import { productoSchema } from "../schemas/Producto.schema";
import Categoria from "../types/categoria";
import Producto from "../types/producto";
import { GeneralContext } from "../contexts/GeneralContext";
import CategoriaFormDialog from "./CategoriaFormDialog";
import UploadImageButton from "./UploadImageButton";

type ProductoFormProps = {
  producto: Partial<Producto>,
  open: boolean,
  onClose: () => void,
  setOpen: () => void,
  title: string,
  categorias: Categoria[],
};

export function ProductoForm(props: ProductoFormProps) {
  const listaCategorias = props.categorias;

  const { openSnackbar } = useContext(GeneralContext);

  const [producto, setProducto] = useState(props.producto);

  const [isValidImageEdit, setIsValidImageEdit] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<
    string>(producto.imagenUrl ? producto.imagenUrl : '');
  const [imageFormData, setImageFormData] = useState<FormData | null>(null);

  const [openCategoriaDialog, setOpenCategoriaDialog] = useState(false);

  const handleCategoriaDialogClose = () => {
    props.setOpen();
    setOpenCategoriaDialog(false);
  };

  const handleUploadImageChange = (url: string, data: FormData, formIsValid: boolean) => {
    setImageFormData(data);
    setImagePreviewUrl(url);
    if (formIsValid) {
      setIsValidImageEdit(true);
    }
  };

  const handlePrecioFocus = (e: any) => {
    e.target.select();
  };

  const onSubmit = async (
    values: Partial<Producto>,
    { setSubmitting, resetForm }: FormikActions<Partial<Producto>>
  ) => {
    let imagenUrl;
    if (imageFormData) {
      try {
        const res = await axiosInstance({
          url: "/attachments/images/upload",
          method: "POST",
          data: imageFormData,
          headers: { "Content-Type": "multipart/form-data" }
        });
        const imageName = res.data.result.files.file[0].name;
        imagenUrl = `${API_URL}/attachments/images/download/${imageName}`;
      } catch (err) {
        console.log("Error al subir la imagen: ", err);
      }
    }
    const productoBody = { ...values, imagenUrl };
    const res = await axiosInstance({
      url: producto.id ? `/productos/${producto.id}` : "/productos",
      method: producto.id ? "PATCH" : "POST",
      data: productoBody
    });
    setSubmitting(false);
    if (res) {
      console.log("Todo OK: ", res);
      openSnackbar("Operación exitosa", "success");
      setImagePreviewUrl('');
    }
    if (producto.imagenUrl) {
      setImagePreviewUrl(producto.imagenUrl);
      setProducto(values);
    }
    resetForm();
    props.onClose();
  };

  return (
    <>
      <Formik
        initialValues={producto}
        validationSchema={productoSchema}
        onSubmit={onSubmit}
        render={({ submitForm, isSubmitting, isValid, values }) => (
          <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth="md"
            fullWidth
            // fullScreen
            scroll="paper"
          >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
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
                  helperText={!producto.id ? "Campo requerido" : null}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpenCategoriaDialog(true);
                          props.setOpen();
                        }}
                        style={{ marginRight: "10px" }}
                      >
                        +
                      </Button>
                    )
                  }}
                >
                  {listaCategorias.map(categoria => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Field>
                <br />
                <UploadImageButton
                  url={imagePreviewUrl}
                  onChange={(url, data) =>
                    handleUploadImageChange(url, data, values === producto)
                  }
                  buttonText={
                    imagePreviewUrl || producto.imagenUrl
                      ? "Cambiar imagen"
                      : "Subir imagen"
                  }
                />
                {!imagePreviewUrl && <p>No hay imagen guardada.</p>}
                <DialogActions>
                  <Button onClick={props.onClose}>Cancelar</Button>
                  <Button
                    color="primary"
                    disabled={isSubmitting || (!isValid && !isValidImageEdit)}
                    onClick={submitForm}
                  >
                    {producto.id ? "Guardar cambios" : "Guardar"}
                  </Button>
                </DialogActions>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      />
      <CategoriaFormDialog
        open={openCategoriaDialog}
        onClose={handleCategoriaDialogClose}
      />
    </>
  );
}

ProductoForm.defaultProps = {
  producto: {
    categoriaId: 1,
  },
  title: "Añadir producto",
} as Partial<ProductoFormProps>;

type CreateProductoFormProps = {
  open: boolean,
  onClose: () => void,
  setOpen: () => void,
  producto?: Producto,
  title?: string,
};

export function CreateProductoForm(props: CreateProductoFormProps) {
  const producto = props.producto ? props.producto : undefined;
  const title = props.title ? props.title : undefined;
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: "/categorias",
    method: "GET",
    trigger: []
  });
  const listaCategorias: Array<Categoria> = response ? response.data : [];

  if (loading || listaCategorias === []) return null;

  return (
    <ProductoForm 
      categorias={listaCategorias}
      open={props.open}
      onClose={props.onClose}
      setOpen={props.setOpen}
      producto={producto}
      title={title}
    />
  );
}


type EditProductoFormProps = {
  id: number,
  open: boolean,
  onClose: () => void,
  setOpen: () => void,
};


export function EditProductoForm({ id, open, onClose, setOpen }: EditProductoFormProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/productos/${id}`,
    method: "GET",
    trigger: []
  });

  const producto = response ? response.data : null;

  if (loading || producto == null) return null;

  return (
    <CreateProductoForm
      producto={producto}
      title="Editar producto"
      open={open}
      onClose={onClose}
      setOpen={setOpen}
    />
  );
}
