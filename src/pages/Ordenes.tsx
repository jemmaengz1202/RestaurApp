import { createStyles, Fab, Grid, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { axiosInstance } from "../api";
import { useConfirmation } from "../components/ConfirmationService";
import MyMaterialTable from "../components/MyMaterialTable";
import { GeneralContext } from "../contexts/GeneralContext";
import useDebounce from "../hooks/useDebounce";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import MyMaterialTabs from "../components/MyMaterialTabs";
import MyMaterialTable2 from "../components/MyMaterialTable2";
import MyMaterialTable3 from "../components/MyMaterialTable3";
import CerrarVentaFormDialog from "../components/CerrarVentaFormDialog";
import OrdenDetalleListDialog from "../components/OrdenDetalleListDialog";
import { OrdenFormDialog } from "../components/OrdenFormDialog";
import { EditOrdenFormDialog } from "../components/OrdenFormDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: theme.spacing(10),
      right: theme.spacing(6),
    },
    table: {
      maxWidth: "100vw",
      margin: "auto",
      overflow: "hidden",
    },
  })
);

export default function Ordenes() {
  const classes = useStyles();
  const { search, openSnackbar, changeTitle, user } = useContext(
    GeneralContext
  );
  const tableRef1 = useRef<any>(null);
  const tableRef2 = useRef<any>(null);
  const tableRef3 = useRef<any>(null);
  const tableRef4 = useRef<any>(null);
  const tableRef5 = useRef<any>(null);
  const dSearch = useDebounce(search, 700);

  const confirm = useConfirmation();

  const [editFormProps, setEditFormProps] = useState({
    id: 0,
    open: false,
  });

  const [newFormOpen, setNewFormOpen] = useState(false);

  const [cerrarOrdenProps, setCerrarOrdenProps] = useState({
    id: 0,
    open: false,
  });

  const [ordenDetalleProps, setOrdenDetalleProps] = useState({
    id: 0,
    open: false,
  });

  useEffect(() => {
    changeTitle("Órdenes");
  }, [changeTitle]);

  const updateTable = useCallback(() => {
    tableRef1.current &&
      (tableRef1.current as any).onQueryChange({ search: dSearch });
    tableRef2.current &&
      (tableRef2.current as any).onQueryChange({ search: dSearch });
    tableRef3.current &&
      (tableRef3.current as any).onQueryChange({ search: dSearch });
    tableRef4.current &&
      (tableRef4.current as any).onQueryChange({ search: dSearch });
    tableRef5.current &&
      (tableRef5.current as any).onQueryChange({ search: dSearch });
  }, [dSearch]);

  useEffect(
    function filterSearch() {
      updateTable();
    },
    [dSearch, updateTable]
  );

  const editElement = (orden: any) => {
    setEditFormProps({
      id: orden.id,
      open: true,
    });
  };

  const setPreparado = (orden: any) => {
    confirm({
      variant: "danger",
      title: "Preparar orden",
      description: `¿Está lista la orden "${orden.id}"?`,
      catchOnCancel: true,
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `ordenes/${orden.id}/set-preparada`,
          method: "POST",
        });

        if (response.status === 200) {
          openSnackbar("Orden preparada", "info");
        }

        updateTable();
      })
      .catch(() => console.log("Err"));
  };

  const cerrarOrden = (orden: any) => {
    setCerrarOrdenProps({
      id: orden.id,
      open: true,
    });
  };

  const handleCerrarOrdenClose = () => {
    updateTable();
    setCerrarOrdenProps({
      id: 0,
      open: false,
    });
  };

  const handleEditFormClose = () => {
    updateTable();
    setEditFormProps({
      id: 0,
      open: false,
    });
  };

  const handleNewFormClose = () => {
    updateTable();
    setNewFormOpen(false);
  };

  const handleOrdenDetalleClose = () => {
    updateTable();
    setOrdenDetalleProps({
      id: 0,
      open: false,
    });
  };

  const verDetallesOrden = (orden: any) => {
    setOrdenDetalleProps({
      id: orden.id,
      open: true,
    });
  };

  const deleteElement = (orden: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación de la orden",
      description: `¿Estás seguro de eliminar la orden "${orden.id}"?`,
      catchOnCancel: true,
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `ordenes/${orden.id}`,
          method: "DELETE",
        });

        if (response.status === 200) {
          openSnackbar("Orden eliminada correctamente", "info");
        }

        updateTable();
      })
      .catch(() => console.log("Err"));
  };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        style={{ width: "auto", margin: 0 }}
        className={classes.table}
      >
        {user && user.role === "cocinero" && (
          <MyMaterialTable2
            title="Listado de órdenes"
            tableRef={tableRef1}
            columns={[
              {
                title: "Inicio",
                field: "inicio",
                render: (rowData: any) => (
                  <>
                    {format(
                      new Date(rowData.inicio),
                      "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                      {
                        locale: es,
                      }
                    )}
                  </>
                ),
              },
              {
                title: "Cierre",
                field: "cierre",
                render: (rowData: any) =>
                  rowData.cierre ? (
                    <>
                      {format(
                        new Date(rowData.cierre),
                        "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                        {
                          locale: es,
                        }
                      )}
                    </>
                  ) : (
                    <></>
                  ),
              },
              {
                title: "Importe",
                field: "importe",
                render: (rowData: any) => <>${rowData.importe}</>,
              },
              { title: "Cliente", field: "cliente.nombre" },
              { title: "Mesa", field: "mesa.nombre" },
              { title: "Mesero", field: "usuario.nombre" },
              {
                title: "Preparada",
                field: "preparada",
                render: (rowData: any) => <>{rowData.preparada ? "✓" : "✗"}</>,
              },
            ]}
            data={async (query) => {
              const response = await axiosInstance.request({
                url: `/ordenes?page=${
                  query.page + 1
                }&filter={"where":{"q":"${encodeURIComponent(
                  query.search ? query.search : ""
                )}","preparada":false},"include":["cliente","usuario","mesa"]}`,
                method: "GET",
              });
              return {
                data: response.data.data,
                page: response.data.meta.currentPage - 1,
                totalCount: response.data.meta.totalItemCount,
              };
            }}
            onPreparadoClick={setPreparado}
            onVerClick={verDetallesOrden}
            actionTitle="Preparado"
          />
        )}
        {user && user.role === "mesero" && (
          <MyMaterialTabs titles={["Todas", "Preparadas", "Pendientes"]}>
            <MyMaterialTable
              title="Listado de órdenes"
              tableRef={tableRef2}
              columns={[
                {
                  title: "Inicio",
                  field: "inicio",
                  render: (rowData: any) => (
                    <>
                      {format(
                        new Date(rowData.inicio),
                        "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                        {
                          locale: es,
                        }
                      )}
                    </>
                  ),
                },
                {
                  title: "Importe",
                  field: "importe",
                  render: (rowData: any) => <>${rowData.importe}</>,
                },
                { title: "Cliente", field: "cliente.nombre" },
                { title: "Mesa", field: "mesa.nombre" },
                { title: "Mesero", field: "usuario.nombre" },
                {
                  title: "Preparada",
                  field: "preparada",
                  render: (rowData: any) => (
                    <>{rowData.preparada ? "✓" : "✗"}</>
                  ),
                },
              ]}
              data={async (query) => {
                const response = await axiosInstance.request({
                  url: `/ordenes?page=${
                    query.page + 1
                  }&filter={"where":{"q":"${encodeURIComponent(
                    query.search ? query.search : ""
                  )}","usuarioId":${
                    user ? user.id : 1
                  },"cierre":null},"include":["cliente","usuario","mesa"]}`,
                  method: "GET",
                });
                return {
                  data: response.data.data,
                  page: response.data.meta.currentPage - 1,
                  totalCount: response.data.meta.totalItemCount,
                };
              }}
              onEditClick={editElement}
              onDeleteClick={deleteElement}
            />
            <MyMaterialTable3
              title="Listado de órdenes preparadas"
              tableRef={tableRef3}
              columns={[
                {
                  title: "Inicio",
                  field: "inicio",
                  render: (rowData: any) => (
                    <>
                      {format(
                        new Date(rowData.inicio),
                        "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                        {
                          locale: es,
                        }
                      )}
                    </>
                  ),
                },
                {
                  title: "Cierre",
                  field: "cierre",
                  render: (rowData: any) =>
                    rowData.cierre ? (
                      <>
                        {format(
                          new Date(rowData.cierre),
                          "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                          {
                            locale: es,
                          }
                        )}
                      </>
                    ) : (
                      <></>
                    ),
                },
                {
                  title: "Importe",
                  field: "importe",
                  render: (rowData: any) => <>${rowData.importe}</>,
                },
                { title: "Cliente", field: "cliente.nombre" },
                { title: "Mesa", field: "mesa.nombre" },
                { title: "Mesero", field: "usuario.nombre" },
                {
                  title: "Preparada",
                  field: "preparada",
                  render: (rowData: any) => (
                    <>{rowData.preparada ? "✓" : "✗"}</>
                  ),
                },
              ]}
              data={async (query) => {
                const response = await axiosInstance.request({
                  url: `/ordenes?page=${
                    query.page + 1
                  }&filter={"where":{"q":"${encodeURIComponent(
                    query.search ? query.search : ""
                  )}","usuarioId":${
                    user ? user.id : 1
                  },"preparada":true,"cierre":null},"include":["cliente","usuario","mesa"]}`,
                  method: "GET",
                });
                return {
                  data: response.data.data,
                  page: response.data.meta.currentPage - 1,
                  totalCount: response.data.meta.totalItemCount,
                };
              }}
              onEditClick={editElement}
              onDeleteClick={deleteElement}
              onCerrarClick={cerrarOrden}
            />
            <MyMaterialTable
              title="Listado de pendientes"
              tableRef={tableRef4}
              columns={[
                {
                  title: "Inicio",
                  field: "inicio",
                  render: (rowData: any) => (
                    <>
                      {format(
                        new Date(rowData.inicio),
                        "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                        {
                          locale: es,
                        }
                      )}
                    </>
                  ),
                },
                {
                  title: "Cierre",
                  field: "cierre",
                  render: (rowData: any) =>
                    rowData.cierre ? (
                      <>
                        {format(
                          new Date(rowData.cierre),
                          "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                          {
                            locale: es,
                          }
                        )}
                      </>
                    ) : (
                      <></>
                    ),
                },
                {
                  title: "Importe",
                  field: "importe",
                  render: (rowData: any) => <>${rowData.importe}</>,
                },
                { title: "Cliente", field: "cliente.nombre" },
                { title: "Mesa", field: "mesa.nombre" },
                { title: "Mesero", field: "usuario.nombre" },
                {
                  title: "Preparada",
                  field: "preparada",
                  render: (rowData: any) => (
                    <>{rowData.preparada ? "✓" : "✗"}</>
                  ),
                },
              ]}
              data={async (query) => {
                const response = await axiosInstance.request({
                  url: `/ordenes?page=${
                    query.page + 1
                  }&filter={"where":{"q":"${encodeURIComponent(
                    query.search ? query.search : ""
                  )}","usuarioId":${
                    user ? user.id : 1
                  },"preparada":false,"cierre":null},"include":["cliente","usuario","mesa"]}`,
                  method: "GET",
                });
                return {
                  data: response.data.data,
                  page: response.data.meta.currentPage - 1,
                  totalCount: response.data.meta.totalItemCount,
                };
              }}
              onEditClick={editElement}
              onDeleteClick={deleteElement}
            />
          </MyMaterialTabs>
        )}
        {user && user.role === "admin" && (
          <MyMaterialTable
            title="Listado de órdenes"
            tableRef={tableRef5}
            columns={[
              {
                title: "Inicio",
                field: "inicio",
                render: (rowData: any) => (
                  <>
                    {format(
                      new Date(rowData.inicio),
                      "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                      {
                        locale: es,
                      }
                    )}
                  </>
                ),
              },
              {
                title: "Cierre",
                field: "cierre",
                render: (rowData: any) =>
                  rowData.cierre ? (
                    <>
                      {format(
                        new Date(rowData.cierre),
                        "dd 'de' MMMM 'del' yyyy 'a las' hh:mm",
                        {
                          locale: es,
                        }
                      )}
                    </>
                  ) : (
                    <></>
                  ),
              },
              {
                title: "Importe",
                field: "importe",
                render: (rowData: any) => <>${rowData.importe}</>,
              },
              { title: "Cliente", field: "cliente.nombre" },
              { title: "Mesa", field: "mesa.nombre" },
              { title: "Mesero", field: "usuario.nombre" },
              {
                title: "Preparada",
                field: "preparada",
                render: (rowData: any) => <>{rowData.preparada ? "✓" : "✗"}</>,
              },
            ]}
            data={async (query) => {
              const response = await axiosInstance.request({
                url: `/ordenes?page=${
                  query.page + 1
                }&filter={"where":{"q":"${encodeURIComponent(
                  query.search ? query.search : ""
                )}"},"include":["cliente","usuario","mesa"]}`,
                method: "GET",
              });
              return {
                data: response.data.data,
                page: response.data.meta.currentPage - 1,
                totalCount: response.data.meta.totalItemCount,
              };
            }}
            onEditClick={editElement}
            onDeleteClick={deleteElement}
          />
        )}
        <Fab
          color="secondary"
          className={classes.fab}
          onClick={() => {
            setNewFormOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
        {editFormProps.id !== 0 && (
          <EditOrdenFormDialog
            open={editFormProps.open}
            onClose={handleEditFormClose}
            ordenId={editFormProps.id}
          />
        )}
        {cerrarOrdenProps.id !== 0 && (
          <CerrarVentaFormDialog
            open={cerrarOrdenProps.open}
            onClose={handleCerrarOrdenClose}
            id={cerrarOrdenProps.id}
          />
        )}
        <OrdenFormDialog open={newFormOpen} onClose={handleNewFormClose} />
        <OrdenDetalleListDialog
          open={ordenDetalleProps.open}
          ordenId={ordenDetalleProps.id}
          onClose={handleOrdenDetalleClose}
        />
      </Grid>
    </Grid>
  );
}
