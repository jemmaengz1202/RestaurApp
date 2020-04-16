import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";

type CerrarVentaFormDialogProps = {
  open: boolean;
  onClose: () => void;
  id: number;
};

export default function CerrarVentaFormDialog({
  open,
  onClose,
  id,
}: CerrarVentaFormDialogProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/ordenes/${id}`,
    method: "GET",
    trigger: [],
  });

  const { openSnackbar } = useContext(GeneralContext);

  const [recibido, setRecibido] = useState(0.0);
  const [cambio, setCambio] = useState(0.0);
  const [error, setError] = useState(false);

  const orden = response ? response.data : null;
  const importe = orden ? orden.importe : 0;

  useEffect(
    function checkError() {
      if (recibido < importe && orden !== null) {
        setError(true);
      } else if (importe === 0 && orden !== null) {
        setError(true);
      } else if (recibido >= importe) {
        setError(false);
        setCambio(recibido - importe);
      }
    },
    [recibido, importe, orden]
  );

  const handleRecibidoChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = +e.currentTarget.value;
    if (!isNaN(+num)) {
      const number = num.toFixed(2);
      setRecibido(Number(number));
    }
  };

  const handleVentaClosed = async () => {
    const data = {
      cierre: new Date().toJSON(),
    };
    const res = await axiosInstance({
      url: `/ordenes/${orden.id}`,
      method: "PATCH",
      data,
    });
    if (res) {
      openSnackbar("Venta cerrada correctamente", "success");
      onClose();
    } else {
      openSnackbar("Hubo un error al intentar cerrar la venta", "error");
      onClose();
    }
  };
  const cambioFixed = cambio.toFixed(2);

  if (loading || orden == null) return null;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle>{`Cerrar venta #${orden.id}`}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">{`Total: $${orden.importe}`}</Typography>
        <Typography variant="subtitle1">{`Cambio: $${cambioFixed}`}</Typography>
        <DialogContentText>
          Para cobrar, introduce un número mayor al total en el campo de texto.
          Después, verifica el cambio y da clic a "Aceptar" para cerrar la
          venta.
        </DialogContentText>
        <TextField
          autoFocus
          margin="normal"
          variant="outlined"
          label="Se recibe:"
          type="number"
          fullWidth
          helperText={error ? "Introduce un número mayor al total" : null}
          error={error}
          onChange={handleRecibidoChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleVentaClosed} color="primary" disabled={error}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
