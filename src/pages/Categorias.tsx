import { createStyles, Fab, Grid, Theme } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
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
import CategoriaFormDialog, { EditCategoriaFormDialog } from "../components/CategoriaFormDialog";

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

export default function Categorias() {
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
    changeTitle("Categorias");
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

  const editElement = (categoria: any) => {
    setEditFormProps({
      id: categoria.id,
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

  const deleteElement = (categoria: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación de la categoría",
      description: `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`,
      catchOnCancel: true
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `categorias/${categoria.id}`,
          method: "DELETE"
        });

        if (response.status === 200) {
          openSnackbar("Categoría eliminada correctamente", "info");
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
          title="Listado de categorías"
          tableRef={tableRef}
          columns={[
            {
              title: "Imagen",
              field: "imagenUrl",
              render: (rowData: any) => (
                <>
                  {rowData.imagenUrl ? (
                    <img
                      style={{width: 170, height: 150}}
                      alt=""
                      src={rowData.imagenUrl}
                    />
                  ) : (
                    <ImageIcon
                      style={{ width: 170, height: 150, padding: 0, margin: 0 }}
                    />
                  )}
                </>
              )
            },
            { title: "Nombre", field: "nombre" },
            { title: "Identificador", field: "id" }
          ]}
          data={async query => {
            const response = await axiosInstance.request({
              url: `/categorias?page=${query.page +
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
          <EditCategoriaFormDialog
            open={editFormProps.open}
            onClose={handleEditFormClose}
            id={editFormProps.id}
          />
        )}
        <CategoriaFormDialog
          open={newFormOpen}
          onClose={handleNewFormClose}
        />
      </Grid>
    </Grid>
  );
}
