import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { Field, Form, Formik, FormikActions } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext, useState } from "react";
import { API_URL, axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";
import { usuarioSchema } from "../schemas/Usuario.schema";
import Usuario from "../types/usuario";
import UploadImageButton from "./UploadImageButton";

type UsuarioFormProps = {
  usuario: Partial<Usuario>;
  open: boolean;
  onClose: () => void;
  setOpen: () => void;
  title: string;
};

export function UsuarioForm(props: UsuarioFormProps) {
  const { openSnackbar } = useContext(GeneralContext);

  const [usuario, setUsuario] = useState<Partial<Usuario>>(
    props.usuario
      ? {
          ...props.usuario,
          password: "",
        }
      : {
          password: "",
          rolId: 2
        }
  );

  const [isValidImageEdit, setIsValidImageEdit] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    usuario.imagenUrl ? usuario.imagenUrl : ""
  );
  const [imageFormData, setImageFormData] = useState<FormData | null>(null);

  const handleUploadImageChange = (
    url: string,
    data: FormData,
    formIsValid: boolean
  ) => {
    setImageFormData(data);
    setImagePreviewUrl(url);
    if (formIsValid) {
      setIsValidImageEdit(true);
    }
  };

  const onSubmit = async (
    values: Partial<Usuario>,
    { setSubmitting, resetForm }: FormikActions<Partial<Usuario>>
  ) => {
    const roleId = values.rolId;
    let principalId;
    let imagenUrl;
    if (!values.password) {
      delete values.password;
    }
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
    const usuarioBody = { ...values, imagenUrl };
    const res = await axiosInstance({
      url: usuario.id ? `/usuarios/${usuario.id}` : "/usuarios",
      method: usuario.id ? "PATCH" : "POST",
      data: usuarioBody
    });
    principalId = res.data.id;
    if (usuario.rolId !== roleId) {
      await axiosInstance({
        url: "/RoleMappings",
        method: "POST",
        data: {
          principalId,
          roleId,
          principalType: "USER"
        }
      });
    }

    setSubmitting(false);
    if (res) {
      openSnackbar("Operación exitosa", "success");
      setImagePreviewUrl("");
    }
    if (usuario.imagenUrl) {
      setImagePreviewUrl(usuario.imagenUrl);
      setUsuario(values);
    }
    resetForm();
    props.onClose();
  };

  return (
    <>
      <Formik
        initialValues={usuario}
        validationSchema={usuarioSchema}
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
                  name="username"
                  type="text"
                  label="Usuario"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <br />
                <Field
                  name="password"
                  type="password"
                  label={usuario.id ? "Nueva contraseña" : "Contraseña"}
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <br />
                <Field
                  name="rolId"
                  type="text"
                  label="Rol"
                  margin="normal"
                  fullWidth
                  component={TextField}
                  select
                  InputLabelProps={{
                    shrink: true
                  }}
                  helperText={!usuario.id ? "Campo requerido" : null}
                  variant="outlined"
                >
                  <MenuItem value={1}>Administrador</MenuItem>
                  <MenuItem value={3}>Mesero</MenuItem>
                  <MenuItem value={2}>Cocinero</MenuItem>
                </Field>
                <br />
                <UploadImageButton
                  imagePreviewUrl={imagePreviewUrl}
                  onChange={(url, data) =>
                    handleUploadImageChange(url, data, values === usuario)
                  }
                  buttonText={
                    imagePreviewUrl || usuario.imagenUrl
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
                    {usuario.id ? "Guardar cambios" : "Guardar"}
                  </Button>
                </DialogActions>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      />
    </>
  );
}

UsuarioForm.defaultProps = {
  producto: {
    categoriaId: 1,
    password: "",
  },
  title: "Añadir usuario"
} as Partial<UsuarioFormProps>;

type EditProductoFormProps = {
  id: number;
  open: boolean;
  onClose: () => void;
  setOpen: () => void;
};

export function EditUsuarioForm({
  id,
  open,
  onClose,
  setOpen
}: EditProductoFormProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/usuarios/${id}?filter[include][roles]`,
    method: "GET",
    trigger: []
  });

  const usuario = response ? response.data : null;

  if (loading || usuario == null) return null;

  usuario.rolId = usuario.roles[0].id;

  return (
    <UsuarioForm
      usuario={usuario}
      title="Editar usuario"
      open={open}
      onClose={onClose}
      setOpen={setOpen}
    />
  );
}
