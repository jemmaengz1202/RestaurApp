import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { Field, Form, Formik, FormikActions } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext, useState } from "react";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";
import Cliente from "../types/cliente";
import InputMask from "react-input-mask";
import { TextField as MTextField } from "@material-ui/core";
import { clienteSchema, editClienteSchema } from "../schemas/Cliente.schema";

type ClienteFormDialogProps = {
  cliente: Partial<Cliente>;
  open: boolean;
  onClose: () => void;
  title: string;
};

export function ClienteFormDialog(props: ClienteFormDialogProps) {
  const { openSnackbar } = useContext(GeneralContext);

  const [cliente] = useState<Partial<Cliente>>(
    props.cliente ? props.cliente : {}
  );

  const [telefono, setTelefono] = useState(
    props.cliente.telefono ? props.cliente.telefono : ""
  );

  const onSubmit = async (
    values: Partial<Cliente>,
    { setSubmitting, resetForm }: FormikActions<Partial<Cliente>>
  ) => {
    const clienteBody = { ...values, telefono };
    const res = await axiosInstance({
      url: cliente.id ? `/clientes/${cliente.id}` : "/clientes",
      method: cliente.id ? "PATCH" : "POST",
      data: clienteBody,
    });

    setSubmitting(false);
    if (res) {
      openSnackbar("Operación exitosa", "success");
    }
    resetForm();
    props.onClose();
  };

  return (
    <>
      <Formik
        initialValues={cliente}
        validationSchema={!props.cliente.id ? clienteSchema : editClienteSchema}
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
                  name="rfc"
                  type="text"
                  label="RFC"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  inputProps={{
                    minLength: 12,
                    maxLength: 13,
                  }}
                />
                <br />
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
                  name="ciudad"
                  type="text"
                  label="Ciudad"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <br />
                <Field
                  name="colonia"
                  type="text"
                  label="Colonia"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <br />
                <Field
                  name="cp"
                  type="text"
                  label="Código postal"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  inputProps={{
                    minLength: 5,
                    maxLength: 5,
                  }}
                />
                <br />
                <Field
                  name="direccion"
                  type="text"
                  label="Dirección"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <br />
                <InputMask
                  mask="(999) 999 99 99"
                  maskChar=""
                  value={telefono}
                  onChange={(e) => setTelefono(e.currentTarget.value)}
                >
                  {() => (
                    <MTextField
                      type="text"
                      label="Número de teléfono"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                </InputMask>
                <br />
                <DialogActions>
                  <Button onClick={props.onClose}>Cancelar</Button>
                  <Button
                    color="primary"
                    disabled={isSubmitting || !isValid}
                    onClick={submitForm}
                  >
                    {cliente.id ? "Guardar cambios" : "Guardar"}
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

ClienteFormDialog.defaultProps = {
  cliente: {},
  title: "Añadir cliente",
} as Partial<ClienteFormDialogProps>;

type EditClienteFormDialogProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

export function EditClienteFormDialog({
  id,
  open,
  onClose,
}: EditClienteFormDialogProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/clientes/${id}`,
    method: "GET",
    trigger: [],
  });

  const cliente = response ? response.data : null;

  if (loading || cliente == null) return null;

  return (
    <ClienteFormDialog
      cliente={cliente}
      title="Editar usuario"
      open={open}
      onClose={onClose}
    />
  );
}
