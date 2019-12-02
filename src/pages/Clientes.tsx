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
import { useConfirmation } from "../components/ConfirmationService";
import MyMaterialTable from "../components/MyMaterialTable";
import { GeneralContext } from "../contexts/GeneralContext";
import useDebounce from "../hooks/useDebounce";
import { EditClienteFormDialog, ClienteFormDialog } from "../components/ClienteFormDialog";

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

export default function Clientes() {
  const classes = useStyles();
  const { search, openSnackbar, changeTitle } = useContext(GeneralContext);
  const tableRef = useRef<any>(null);
  const dSearch = useDebounce(search, 700);

  const confirm = useConfirmation();

  const [editFormProps, setEditFormProps] = useState({
    id: 0,
    open: false
  });

  const [newFormOpen, setNewFormOpen] = useState(false);

  useEffect(() => {
    changeTitle("Clientes");
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

  const editElement = (cliente: any) => {
    setEditFormProps({
      id: cliente.id,
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

  const deleteElement = (cliente: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación del cliente",
      description: `¿Estás seguro de eliminar el cliente "${cliente.nombre}"?`,
      catchOnCancel: true
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `clientes/${cliente.id}`,
          method: "DELETE"
        });

        if (response.status === 200) {
          openSnackbar("Cliente eliminado correctamente", "info");
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
        <MyMaterialTable
          title="Listado de clientes"
          tableRef={tableRef}
          columns={[
            { title: "Identificador", field: "id" },
            { title: "RFC", field: "rfc" },
            { title: "Nombre", field: "nombre" },
            { title: "Ciudad", field: "ciudad" }
          ]}
          data={async query => {
            const response = await axiosInstance.request({
              url: `/clientes?page=${query.page +
                1}&filter[where][q]=${encodeURIComponent(
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
          <EditClienteFormDialog
            open={editFormProps.open}
            onClose={handleEditFormClose}
            id={editFormProps.id}
          />
        )}
        <ClienteFormDialog
          open={newFormOpen}
          onClose={handleNewFormClose}
        />
      </Grid>
    </Grid>
  );
}
