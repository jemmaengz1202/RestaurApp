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
import {
  EditMesaFormDialog,
  MesaFormDialog
} from "../components/MesaFormDialog";

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

export default function Mesas() {
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
    changeTitle("Mesas");
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

  const editElement = (mesa: any) => {
    setEditFormProps({
      id: mesa.id,
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

  const deleteElement = (mesa: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación de la mesa",
      description: `¿Estás seguro de eliminar la mesa "${mesa.nombre}"?`,
      catchOnCancel: true
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `mesas/${mesa.id}`,
          method: "DELETE"
        });

        if (response.status === 200) {
          openSnackbar("Mesa eliminado correctamente", "info");
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
          title="Listado de mesas"
          tableRef={tableRef}
          columns={[
            { title: "Nombre", field: "nombre" },
            {
              title: "Observaciones",
              field: "disponible",
              render: (rowData: any) => (
                <>
                  {rowData.observaciones
                    ? rowData.observaciones.length >= 140
                      ? `${rowData.observaciones.substr(0, 140)}...`
                      : rowData.observaciones
                    : ""}
                </>
              )
            },
            {
              title: "¿Está disponible?",
              field: "disponible",
              render: (rowData: any) => (
                <>
                  {rowData.disponible
                    ? "Sí está disponible"
                    : "No está disponible"}
                </>
              )
            }
          ]}
          data={async query => {
            const response = await axiosInstance.request({
              url: `/mesas?page=${query.page +
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
          <EditMesaFormDialog
            open={editFormProps.open}
            onClose={handleEditFormClose}
            id={editFormProps.id}
          />
        )}
        <MesaFormDialog open={newFormOpen} onClose={handleNewFormClose} />
      </Grid>
    </Grid>
  );
}
