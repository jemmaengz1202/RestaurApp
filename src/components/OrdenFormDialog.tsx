import React, { useState, useEffect, useContext, useRef } from "react";
import AddIcon from "@material-ui/icons/Add";
import {
  Dialog,
  AppBar,
  createStyles,
  Toolbar,
  IconButton,
  Slide,
  Typography,
  Theme,
  Button,
  TextField,
  MenuItem,
  Grid,
  Fab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import Orden from "../types/orden";
import { TransitionProps } from "@material-ui/core/transitions";
import OrdenDetalle from "../types/orden-detalle";
import useAxios from "@use-hooks/axios";
import { axiosInstance } from "../api";
import MyAsyncSelect, { OptionType } from "./MyAsyncSelect";
import { ValueType } from "react-select";
import { GeneralContext } from "../contexts/GeneralContext";
import MyMaterialTableWithoutPages from "./MyMaterialTableWithoutPages";
import { useConfirmation } from "./ConfirmationService";
import OrdenDetalleFormDialog, {
  EditOrdenDetalleFormDialog,
} from "./OrdenDetalleFormDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(10),
      right: theme.spacing(6),
    },
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

type OrdenFormDialogProps = {
  orden: Partial<Orden>;
  ordenDetalles: Partial<OrdenDetalle>[];
  open: boolean;
  onClose: () => void;
};

export function OrdenFormDialog({
  orden,
  open,
  onClose,
  ordenDetalles,
}: OrdenFormDialogProps) {
  const classes = useStyles();

  const { user, openSnackbar } = useContext(GeneralContext);

  const confirm = useConfirmation();

  const tableRef1 = useRef<any>(null);

  const [clienteIdValue, setClienteIdValue] = useState<ValueType<OptionType>>();
  const [mesaId, setMesaId] = useState<number>(orden.mesaId ? orden.mesaId : 0);

  const [ordenDetallesNuevas, setOrdenDetallesNuevas] = useState<
    Partial<OrdenDetalle>[]
  >([]);

  const [ordenDetallesEditadas, setOrdenDetallesEditadas] = useState<
    Partial<OrdenDetalle>[]
  >([]);

  const [ordenDetallesAEliminar, setOrdenDetallesAEliminar] = useState<
    Array<number>
  >([]);

  const [ordenDetallesTodas, setOrdenDetallesTodas] = useState<Array<any>>([]);

  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: "/mesas",
    method: "GET",
    trigger: [],
  });

  const [nuevaOrdenDetalleOpen, setNuevaOrdenDetalleOpen] = useState(false);

  const [editOrdenDetalleProps, setEditOrdenDetalleProps] = useState({
    id: 0,
    open: false,
    ordenId: 0,
    ordenDetalleAEditar: null,
  });

  useEffect(
    function mapOrdenesSubtotal() {
      setOrdenDetallesTodas(
        (ordenDetalles as any).map((od: any) => ({
          ...od,
          subtotal: od.producto.precio * od.cantidad,
        }))
      );
    },
    [ordenDetalles]
  );

  useEffect(
    function changeClienteId() {
      if (!orden.clienteId) {
        setClienteIdValue({ label: "Cliente normal", value: 1 } as any);
      } else {
        axiosInstance({
          url: `/clientes/${orden.clienteId}`,
          method: "GET",
        })
          .then((responseOrden) => {
            setClienteIdValue({
              label: responseOrden.data.nombre,
              value: responseOrden.data.id,
            } as any);
          })
          .catch((err) => console.log(err));
      }
    },
    [orden.clienteId]
  );

  const mesas = response ? response.data : null;

  if (loading || mesas === null) return null;

  if (orden.id && ordenDetalles.length === 0) {
    return null;
  }

  const handleEditOrdenDetalleClick = (rowData: any) => {
    if (orden.id) {
      setEditOrdenDetalleProps({
        ordenId: orden.id,
        open: true,
        id: rowData.id,
        ordenDetalleAEditar: rowData,
      });
    }
  };

  const handleDeleteOrdenDetalleClick = (ordenDetalle: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación de la orden",
      description: `¿Estás seguro de eliminar este elemento?`,
      catchOnCancel: true,
    })
      .then(async () => {
        if (orden.id) {
          setOrdenDetallesAEliminar((odae) => [...odae, ordenDetalle.id]);
        }
        setOrdenDetallesTodas((odt) => {
          // odt.filter(od => od.id !== ordenDetalle.id)
          let odtN = [];
          let eliminado = false;
          for (let i = 0; i < odt.length; i++) {
            const element = odt[i];
            if (
              !eliminado &&
              element.cantidad === ordenDetalle.cantidad &&
              element.productoId === ordenDetalle.productoId
            ) {
              eliminado = true;
              continue;
            }
            odtN.push(element);
          }
          return odtN;
        });
      })
      .catch(() => console.log("Err"));
  };

  const update = async () => {
    const cIdValue: any = clienteIdValue;
    let importe = 0;
    ordenDetallesTodas.forEach((od) => {
      importe += od.subtotal;
    });
    const ordenBody = {
      mesaId: mesaId ? mesaId : mesas[0].id,
      clienteId: cIdValue.value ? cIdValue.value : 1,
      importe,
    };

    const responseOrden = await axiosInstance({
      url: `/ordenes/${orden.id ? orden.id : ""}`,
      method: "PATCH",
      data: ordenBody,
    });

    if (responseOrden) {
      openSnackbar("Cambios guardados correctamente", "success");

      if (ordenDetallesNuevas.length > 0) {
        const odn = ordenDetallesNuevas.map((el) => ({
          ...el,
          ordenId: responseOrden.data.id,
        }));
        await axiosInstance({
          url: `ordenes_detalles`,
          method: "POST",
          data: odn,
        });
      }
      if (ordenDetallesEditadas.length > 0) {
        const ode = ordenDetallesEditadas.map((el) => ({
          ...el,
          ordenId: responseOrden.data.id,
        }));
        ode.forEach((od) => {
          axiosInstance({
            url: `ordenes_detalles`,
            method: "PATCH",
            data: od,
          })
            .then((_) => [])
            .catch((err) => console.log(err));
        });
      }
      if (ordenDetallesAEliminar.length > 0) {
        for (let i = 0; i < ordenDetallesAEliminar.length; i++) {
          const element = ordenDetallesAEliminar[i];
          await axiosInstance({
            url: `/ordenes_detalles/${element}`,
            method: "DELETE",
          });
        }
      }
    }

    onClose();
  };

  const create = async () => {
    let importe = 0;
    ordenDetallesTodas.forEach((od) => {
      importe += od.subtotal;
    });
    const cIdValue: any = clienteIdValue;
    const ordenBody = {
      clienteId: cIdValue.value ? cIdValue.value : 1,
      importe,
      mesaId: mesaId ? mesaId : mesas[0].id,
      preparada: false,
      usuarioId: user ? user.id : null,
      inicio: new Date().toJSON(),
    };

    const responseOrden = await axiosInstance({
      url: "/ordenes",
      method: "POST",
      data: ordenBody,
    });

    if (responseOrden) {
      const ordenId = responseOrden.data.id;
      const ordenDetallesBody = ordenDetallesNuevas.map((el) => ({
        ...el,
        ordenId,
      }));
      const responseOrdenDetalles = await axiosInstance({
        url: "/ordenes_detalles",
        method: "POST",
        data: ordenDetallesBody,
      });
      if (responseOrdenDetalles.status === 200) {
        openSnackbar("Orden guardada correctamente", "success");
      }
    }

    onClose();
  };

  const handleNuevaOrdenDetalleSubmit = (od: any) => {
    setOrdenDetallesNuevas((odn) => [...odn, od]);
    setOrdenDetallesTodas((odt) => [...odt, od]);
  };

  const handleEditOrdenDetalleSubmit = (od: any) => {
    console.log("Orden detalle editada:", od);
    if (od.ordenId) {
      setOrdenDetallesEditadas((ode) => [...ode, od]);
    }
    setOrdenDetallesTodas((odt) => {
      let odtNuevas: any[] = [];
      let insertado = false;
      for (let i = 0; i < odt.length; i++) {
        const element = odt[i];
        if (!insertado && element.productoId === od.productoId) {
          insertado = true;
          odtNuevas.push(od);
          continue;
        }
        odtNuevas.push(element);
      }

      return odtNuevas;
    });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {orden.id ? `Orden #${orden.id}` : "Nueva orden"}
          </Typography>
          <Button
            color="inherit"
            onClick={orden.id ? update : create}
            disabled={ordenDetallesTodas.length === 0}
          >
            {/* TODO: Desactivar botón cuando no haya ordenDetallesTodas */}
            Guardar
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        <form>
          <Grid
            container
            alignItems="flex-start"
            justify="center"
            spacing={2}
            style={{ marginBottom: 20 }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                select
                type="text"
                label="Mesa"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={!orden.id ? "Campo requerido" : null}
                fullWidth
                variant="outlined"
                value={mesaId ? mesaId : mesas[0].id}
                onChange={(e) => setMesaId(Number(e.target.value))}
              >
                {mesas.map((mesa: any) => (
                  <MenuItem key={mesa.id} value={mesa.id}>
                    {mesa.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MyAsyncSelect
                value={clienteIdValue}
                label="Cliente"
                onChange={(v) => {
                  setClienteIdValue(v as any);
                }}
                loadOptions={async (inputValue) => {
                  const responseOrden = await axiosInstance({
                    url: `/clientes?page=1&filter[where][q]=${
                      inputValue ? inputValue : ""
                    }`,
                    method: "GET",
                  });
                  if (responseOrden) {
                    return responseOrden.data.data.map((v: any) => ({
                      label: v.nombre,
                      value: v.id,
                    }));
                  }
                  return [];
                }}
              />
            </Grid>
          </Grid>
        </form>
        <MyMaterialTableWithoutPages
          title="Detalles de la orden"
          data={ordenDetallesTodas ? ordenDetallesTodas : []}
          tableRef={tableRef1}
          columns={[
            { title: "Cantidad", field: "cantidad" },
            { title: "Producto", field: "producto.nombre" },
            {
              title: "Subtotal",
              field: "subtotal",
              render: (rowData: any) => <>${rowData.subtotal}</>,
            },
            { title: "Anotaciones", field: "anotaciones" },
          ]}
          onEditClick={handleEditOrdenDetalleClick}
          onDeleteClick={handleDeleteOrdenDetalleClick}
        />
        <Fab
          color="secondary"
          className={classes.fab}
          onClick={() => {
            setNuevaOrdenDetalleOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
        {nuevaOrdenDetalleOpen && (
          <OrdenDetalleFormDialog
            open={nuevaOrdenDetalleOpen}
            onClose={() => setNuevaOrdenDetalleOpen(false)}
            onSubmit={handleNuevaOrdenDetalleSubmit}
          />
        )}
        {editOrdenDetalleProps.id !== 0 && (
          <EditOrdenDetalleFormDialog
            open={editOrdenDetalleProps.open}
            id={editOrdenDetalleProps.id}
            ordenId={editOrdenDetalleProps.ordenId}
            onClose={() => {
              setEditOrdenDetalleProps({
                open: false,
                id: 0,
                ordenId: 0,
                ordenDetalleAEditar: null,
              });
            }}
            ordenDetalleAEditar={editOrdenDetalleProps.ordenDetalleAEditar}
            onSubmit={handleEditOrdenDetalleSubmit}
          />
        )}
      </div>
    </Dialog>
  );
}

OrdenFormDialog.defaultProps = {
  orden: {},
  ordenDetalles: [],
} as Partial<OrdenFormDialogProps>;

type EditOrdenFormDialogProps = {
  ordenId: number;
  open: boolean;
  onClose: () => void;
};

export function EditOrdenFormDialog({
  ordenId,
  open,
  onClose,
}: EditOrdenFormDialogProps) {
  const { response: responseOrden, loading: loadingOrden } = useAxios({
    axios: axiosInstance,
    url: `/ordenes/${ordenId}`,
    method: "GET",
    trigger: [],
  });

  const {
    response: responseOrdenDetalles,
    loading: loadingOrdenDetalles,
  } = useAxios({
    axios: axiosInstance,
    url: `/ordenes/${ordenId}/ordenDetalles?filter[include][producto]`,
    method: "GET",
    trigger: [],
  });

  const orden = responseOrden ? responseOrden.data : null;
  const ordenDetalles = responseOrdenDetalles
    ? responseOrdenDetalles.data
    : null;

  if (
    loadingOrden ||
    orden == null ||
    loadingOrdenDetalles ||
    ordenDetalles == null
  )
    return null;

  return (
    <OrdenFormDialog
      open={open}
      onClose={onClose}
      orden={orden}
      ordenDetalles={ordenDetalles}
    />
  );
}
