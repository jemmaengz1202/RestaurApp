import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { axiosInstance } from "../api";
import useAxios from "@use-hooks/axios";
import OrdenDetalle from "../types/orden-detalle";
import MyAsyncSelect, { OptionType } from "./MyAsyncSelect";
import { ValueType } from "react-select";

type OrdenDetalleFormDialogProps = {
  open: boolean;
  onClose: () => void;
  ordenDetalle: Partial<OrdenDetalle>;
  title: string;
  ordenId: number;
  onSubmit: (val: any) => void;
};

export default function OrdenDetalleFormDialog(
  props: OrdenDetalleFormDialogProps
) {
  const ordenDetalle = !props.ordenId
    ? props.ordenDetalle
    : { ...props.ordenDetalle, ordenId: props.ordenId };

  const [anotaciones, setAnotaciones] = useState(
    ordenDetalle.anotaciones ? ordenDetalle.anotaciones : ""
  );

  const handleAnotacionesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnotaciones(e.target.value);
  };

  const [cantidad, setCantidad] = useState(
    ordenDetalle.cantidad ? ordenDetalle.cantidad : 1
  );

  const [productoIdValue, setClienteIdValue] = useState<
    ValueType<OptionType>
  >();

  useEffect(
    function changeProductoIdValue() {
      if (ordenDetalle.productoId) {
        axiosInstance({
          url: `/productos/${ordenDetalle.productoId}`,
          method: "GET",
        })
          .then((responseProducto) => {
            setClienteIdValue({
              label: responseProducto.data.nombre,
              value: responseProducto.data.id,
            } as any);
          })
          .catch((err) => console.log(err));
      }
    },
    [ordenDetalle.productoId]
  );

  const handleOrdenDetalleClick = async () => {
    const pIdValue = productoIdValue as any;
    const response = await axiosInstance({
      url: `/productos/${pIdValue.value}`,
      method: "GET",
    });
    const producto = response.data;
    const subtotal = producto.precio * cantidad;
    const ordenDetalleCreada = {
      ...ordenDetalle,
      anotaciones,
      cantidad,
      productoId: pIdValue.value,
      subtotal,
      producto,
    };
    props.onClose();
    props.onSubmit(ordenDetalleCreada);
  };

  const handleCantidadFocus = (e: any) => {
    e.target.select();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>
        {props.title ? props.title : "Añadir detalle de la orden"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Cantidad"
          fullWidth
          type="number"
          onChange={(val) => setCantidad(Number(val.target.value))}
          value={cantidad}
          onFocus={handleCantidadFocus}
        />
        <br />
        <MyAsyncSelect
          value={productoIdValue}
          label="Producto"
          onChange={(v) => {
            setClienteIdValue(v as any);
          }}
          loadOptions={async (inputValue) => {
            const responseProducto = await axiosInstance({
              url: `/productos?page=1&filter[where][q]=${
                inputValue ? inputValue : ""
              }`,
              method: "GET",
            });
            if (responseProducto) {
              return responseProducto.data.data.map((v: any) => ({
                label: v.nombre,
                value: v.id,
              }));
            }
            return [];
          }}
        />
        <br />
        <TextField
          margin="dense"
          label="Anotaciones"
          fullWidth
          type="text"
          multiline
          rowsMax={5}
          onChange={handleAnotacionesChange}
          value={anotaciones}
        />
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button
          onClick={handleOrdenDetalleClick}
          color="primary"
          disabled={!productoIdValue || !cantidad}
        >
          {ordenDetalle.id ? "Guardar" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrdenDetalleFormDialog.defaultProps = {
  ordenDetalle: {},
} as Partial<OrdenDetalleFormDialogProps>;

type EditOrdenDetalleFormDialogProps = {
  id: number;
  open: boolean;
  onClose: () => void;
  ordenId: number;
  onSubmit: (val: any) => void;
  ordenDetalleAEditar?: any;
};

export function EditOrdenDetalleFormDialog({
  id,
  open,
  onClose,
  onSubmit,
  ordenDetalleAEditar,
}: EditOrdenDetalleFormDialogProps) {
  let idD = id ? id : 1;
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/ordenes_detalles/${idD}`,
    method: "GET",
    trigger: [],
  });

  const ordenDetalle = response ? response.data : null;

  if (loading || ordenDetalle == null) return null;

  return (
    <OrdenDetalleFormDialog
      ordenDetalle={ordenDetalleAEditar ? ordenDetalleAEditar : ordenDetalle}
      title="Editar detalle de orden"
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
