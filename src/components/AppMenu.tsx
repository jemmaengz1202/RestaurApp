import List from "@material-ui/core/List";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import ReceiptIcon from "@material-ui/icons/Receipt";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import CategoryIcon from "@material-ui/icons/Category";
import React, { useContext } from "react";
import AppMenuItem from "./AppMenuItem";
import { GeneralContext } from "../contexts/GeneralContext";
import AssignmentIcon from "@material-ui/icons/Assignment";

const items = [
  {
    name: "Inicio",
    link: "/",
    Icon: HomeIcon
  },
  {
    name: "Acceder",
    link: "/signin",
    Icon: LockOpenIcon
  },
  {
    name: "Productos",
    link: "/productos",
    Icon: FastfoodIcon
  },
  {
    name: "Categorías",
    link: "/categorias",
    Icon: CategoryIcon
  },
  {
    name: "Clientes",
    link: "/clientes",
    Icon: PeopleIcon
  },
  {
    name: "Órdenes",
    link: "/ordenes",
    Icon: ReceiptIcon
  },
  {
    name: "Mesas",
    link: "/mesas",
    Icon: CheckBoxOutlineBlankIcon
  },
  {
    name: "Reporte",
    link: "/reporte",
    Icon: AssignmentIcon
  },
  {
    name: "Usuarios",
    link: "/usuarios",
    Icon: AccountBoxIcon
  },
  {
    name: "Cerrar sesión",
    link: "/signout",
    Icon: ExitToAppIcon
  }
];

const AppMenu: React.FC = () => {
  const classes = useStyles();

  const { user, isSignedIn } = useContext(GeneralContext);
  const role = user ? user.role : "none";
  const menuEntries =
    role === "mesero"
      ? ["Inicio", "Productos", "Clientes", "Órdenes", "Cerrar sesión"]
      : role === "cocinero"
      ? ["Inicio", "Productos", "Órdenes", "Cerrar sesión"]
      : role === "admin"
      ? [
          "Inicio",
          "Productos",
          "Categorías",
          "Clientes",
          "Órdenes",
          "Mesas",
          "Reporte",
          "Usuarios",
          "Cerrar sesión"
        ]
      : !isSignedIn
      ? ["Inicio", "Productos", "Acceder"]
      : [];

  const appMenuItems = items.filter(el => menuEntries.includes(el.name));

  return (
    <List component="nav" className={classes.appMenu} disablePadding>
      {/* <AppMenuItem {...appMenuItems[0]} /> */}
      {appMenuItems.map((item, index) => (
        <AppMenuItem {...item} key={index} />
      ))}
    </List>
  );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appMenu: {
      width: "100%"
    },
    navList: {
      width: drawerWidth
    },
    menuItem: {
      width: drawerWidth
    },
    menuItemIcon: {
      color: theme.palette.primary.main
    }
  })
);

export default AppMenu;
