import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import useAxios from "@use-hooks/axios";
import { axiosInstance } from "../api";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

type OrdenDetallesListProps = {
  ordenId: number;
};

export function OrdenDetallesList({ ordenId }: OrdenDetallesListProps) {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/ordenes_detalles?filter={"where":{"ordenId":${ordenId}},"include":"producto"}`,
    method: "GET",
    trigger: [],
  });

  const history = useHistory();

  const ordenDetalles = response ? response.data : null;

  if (loading || ordenDetalles == null) return null;

  return (
    <List>
      {ordenDetalles.map((el: any) => (
        <React.Fragment key={el.id}>
          <ListItem button onClick={() => history.push(`/productos/${el.id}`)}>
            <ListItemText
              primary={`${el.cantidad} ${el.producto.nombre}`}
              secondary={el.descripcion}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

type OrdenDetalleListDialogProps = {
  ordenId: number;
  open: boolean;
  onClose: () => void;
};

export default function OrdenDetalleListDialog({
  ordenId,
  open,
  onClose,
}: OrdenDetalleListDialogProps) {
  const classes = useStyles();

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
            Orden #{ordenId}
          </Typography>
        </Toolbar>
      </AppBar>
      <OrdenDetallesList ordenId={ordenId} />
    </Dialog>
  );
}
