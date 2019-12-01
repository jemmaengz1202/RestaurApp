import { Avatar, createStyles, Fab, Grid, Theme } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
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
import { EditUsuarioForm, UsuarioForm } from "../components/UsuarioForm";
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

export default function Usuarios() {
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
    changeTitle("Usuarios");
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

  const editElement = (usuario: any) => {
    setEditFormProps({
      id: usuario.id,
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

  const deleteElement = (usuario: any) => {
    confirm({
      variant: "danger",
      title: "Confirmar eliminación del usuario",
      description: `¿Estás seguro de eliminar el usuario "${usuario.nombre}"?`,
      catchOnCancel: true
    })
      .then(async () => {
        const response = await axiosInstance({
          url: `usuarios/${usuario.id}`,
          method: "DELETE"
        });

        if (response.status === 200) {
          openSnackbar("Usuario eliminado correctamente", "info");
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
          title="Listado de usuarios"
          tableRef={tableRef}
          columns={[
            {
              title: "Imagen",
              field: "imagenUrl",
              render: (rowData: any) => (
                <>
                  {rowData.imagenUrl ? (
                    <Avatar
                      style={{ width: 150, height: 150 }}
                      alt=""
                      src={rowData.imagenUrl || missingImage}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{ width: 150, height: 150, padding: 0, margin: 0 }}
                    />
                  )}
                </>
              )
            },
            { title: "Identificador", field: "id" },
            { title: "Nombre", field: "nombre" },
            { title: "Rol", field: "roles[0].name" },
            { title: "Usuario", field: "username" }
          ]}
          data={async query => {
            const response = await axiosInstance.request({
              url: `/usuarios?page=${query.page +
                1}&filter[include][roles]&filter[where][q]=${encodeURIComponent(
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
          <EditUsuarioForm
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
        <UsuarioForm
          open={newFormOpen}
          onClose={handleNewFormClose}
          setOpen={() => {
            setNewFormOpen(!newFormOpen);
          }}
        />
      </Grid>
    </Grid>
  );
}
