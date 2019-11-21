import { createStyles, Fab, Grid, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { axiosInstance } from "../api";
import CategoriasList from "../components/CategoriasList";
import { useConfirmation } from "../components/ConfirmationService";
import MyMaterialTable from "../components/MyMaterialTable";
import MyMaterialTabs from "../components/MyMaterialTabs";
import { EditProductoForm, CreateProductoForm } from "../components/ProductoForm";
import ProductosList from "../components/ProductosList";
import { GeneralContext } from "../contexts/GeneralContext";
import useDebounce from "../hooks/useDebounce";
import missingImage from "../img/missing.jpg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: theme.spacing(10),
      right: theme.spacing(6)
    },
    table: {
      maxWidth: "100vw",
      margin: "auto",
      overflow: "hidden"
    }
  })
);

export default function Productos() {
  const classes = useStyles();
  const { isSignedIn, search, openSnackbar, user, changeTitle } = useContext(
    GeneralContext
  );
  const tableRef = useRef<any>(null);
  const dSearch = useDebounce(search, 700);

  const confirm = useConfirmation();

  const [editFormProps, setEditFormProps] = useState({
    id: 0,
    open: false
  });

  const [newFormOpen, setNewFormOpen] = useState(false);

  useEffect(() => {
    changeTitle("Productos");
  }, [changeTitle]);

  const updateTable = useCallback(() => {
    tableRef.current &&
      (tableRef.current as any).onQueryChange({ search: dSearch });
  }, [dSearch]);

  useEffect(
    function filterSearch() {
      updateTable();
    },
    [dSearch, updateTable]
  );

  const editElement = (producto: any) => {
    setEditFormProps({
      id: producto.id,
      open: true
    });
  };

  const handleEditFormClose = () => {
    updateTable();
    setEditFormProps({
      id: 0,
      open: false
    });
  };

  const handleNewFormClose = () => {
    updateTable();
    setNewFormOpen(false);
  };

  const deleteElement = (producto: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación del producto",
      description: `¿Estás seguro de eliminar el producto "${producto.nombre}"?`,
      catchOnCancel: true
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `productos/${producto.id}`,
          method: "DELETE"
        });

        if (response.status === 200) {
          openSnackbar("Producto eliminado correctamente", "info");
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
        {isSignedIn && user && user.role === "admin" && (
          <>
            <MyMaterialTable
              title="Listado de productos"
              tableRef={tableRef}
              columns={[
                {
                  title: "Imagen",
                  field: "imagenUrl",
                  render: (rowData: any) => (
                    <img
                      style={{ height: 100, width: 100 }}
                      src={rowData.imagenUrl || missingImage}
                      alt=""
                    />
                  )
                },
                { title: "Identificador", field: "id" },
                { title: "Nombre", field: "nombre" },
                {
                  title: "Precio",
                  field: "precio",
                  render: (rowData: any) => <>${rowData.precio}</>
                },
                { title: "Categoria", field: "categoria.nombre" }
              ]}
              data={async query => {
                const response = await axiosInstance.request({
                  url: `/productos?page=${query.page +
                    1}&filter[include][categoria]&filter[where][q]=${encodeURIComponent(
                    query.search ? query.search : ""
                  )}`,
                  method: "GET"
                });
                return {
                  data: response.data.data,
                  page: response.data.meta.currentPage - 1,
                  totalCount: response.data.meta.totalItemCount
                };
              }}
              onEditClick={editElement}
              onDeleteClick={deleteElement}
            />
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
              <EditProductoForm
                open={editFormProps.open}
                onClose={handleEditFormClose}
                id={editFormProps.id}
                setOpen={() =>
                  setEditFormProps(s => ({
                    ...s,
                    open: !s.open
                  }))
                }
              />
            )}
            <CreateProductoForm
              open={newFormOpen}
              onClose={handleNewFormClose}
              setOpen={() => {
                setNewFormOpen(!newFormOpen)
                // setForegroundDialogOpen(!foregroundDialogOpen);
                console.log("Yaaaa");
              }}
            />
          </>
        )}
        {((user && user.role !== "admin") || !isSignedIn) && (
          <MyMaterialTabs titles={["Por categoría", "Todos los productos"]}>
            <CategoriasList />
            <ProductosList />
          </MyMaterialTabs>
        )}
      </Grid>
    </Grid>
  );
}
