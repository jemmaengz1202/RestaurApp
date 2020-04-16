import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { Field, Form, Formik, FormikActions } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext, useState } from "react";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";
import Mesa from "../types/mesa";
import { mesaSchema, editMesaSchema } from "../schemas/Mesa.schema";

type MesaFormDialogProps = {
  mesa: Partial<Mesa>;
  open: boolean;
  onClose: () => void;
  title: string;
};

export function MesaFormDialog(props: MesaFormDialogProps) {
  const { openSnackbar } = useContext(GeneralContext);

  const [mesa] = useState<Partial<Mesa>>(props.mesa ? props.mesa : {});

  const [disponible, setDisponible] = useState(!!props.mesa.disponible);

  const [cambio, setCambio] = useState(false);

  const onSubmit = async (
    values: Partial<Mesa>,
    { setSubmitting, resetForm }: FormikActions<Partial<Mesa>>
  ) => {
    const mesaBody = { ...values, disponible };
    const res = await axiosInstance({
      url: mesa.id ? `/mesas/${mesa.id}` : "/mesas",
      method: mesa.id ? "PATCH" : "POST",
      data: mesaBody,
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
        initialValues={mesa}
        validationSchema={!props.mesa.id ? mesaSchema : editMesaSchema}
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
                  name="observaciones"
                  type="text"
                  label="Observaciones"
                  component={TextField}
                  variant="outlined"
                  multiline
                  margin="normal"
                  fullWidth
                  rowsMax="5"
                />
                <br />
                <FormControlLabel
                  control={
                    <Field
                      label={disponible ? "Disponible" : "No disponible"}
                      component={Switch}
                      onChange={(e: any) => {
                        setDisponible((val) => !val);
                        setCambio(true);
                      }}
                      checked={disponible}
                    />
                  }
                  label={disponible ? "Disponible" : "No disponible"}
                />
                <br />
                <DialogActions>
                  <Button onClick={props.onClose}>Cancelar</Button>
                  <Button
                    color="primary"
                    disabled={(isSubmitting || !isValid) && !cambio}
                    onClick={submitForm}
                  >
                    {mesa.id ? "Guardar cambios" : "Guardar"}
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

MesaFormDialog.defaultProps = {
  mesa: {},
  title: "Añadir mesa",
} as Partial<MesaFormDialogProps>;

type EditMesaFormDialogProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

export function EditMesaFormDialog({
  id,
  open,
  onClose,
}: EditMesaFormDialogProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/mesas/${id}`,
    method: "GET",
    trigger: [],
  });

  const mesa = response ? response.data : null;

  if (loading || mesa == null) return null;

  return (
    <MesaFormDialog
      mesa={mesa}
      title="Editar usuario"
      open={open}
      onClose={onClose}
    />
  );
}
