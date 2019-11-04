import List from '@material-ui/core/List';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import ReceiptIcon from '@material-ui/icons/Receipt';
import React, { useContext } from 'react';
import AppMenuItem from './AppMenuItem';
import { GeneralContext } from '../contexts/GeneralContext';

const items = [
  {
    name: 'Inicio',
    link: '/',
    Icon: HomeIcon
  },
  {
    name: 'Productos',
    link: '/productos',
    Icon: FastfoodIcon
  },
  {
    name: 'Clientes',
    link: '/clientes',
    Icon: PeopleIcon
  },
  {
    name: 'Órdenes',
    link: '/ordenes',
    Icon: ReceiptIcon,
  },
  {
    name: 'Mesas',
    link: '/ordenes',
    Icon: CheckBoxOutlineBlankIcon,
  },
  {
    name: 'Usuarios',
    link: '/usuarios',
    Icon: AccountBoxIcon,
  },
  {
    name: 'Cerrar sesión',
    link: '/signout',
    Icon: ExitToAppIcon,
  },
];


const AppMenu: React.FC = () => {
  const classes = useStyles();

  const { user, isSignedIn } = useContext(GeneralContext);
  const role = user ? user.role : 'none';
  const menuEntries = 
    (role === 'mesero') ? ['Inicio', 'Productos', 'Clientes', 'Órdenes', 'Cerrar sesión'] 
  : (role === 'cocinero') ? ['Inicio', 'Productos', 'Ordenes', 'Cerrar sesión']
  : !isSignedIn ? ['Inicio', 'Productos']
  : [];

  const appMenuItems = 
    role !== 'admin' ? items.filter(el => menuEntries.includes(el.name))
    : items;

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
      width: '100%'
    },
    navList: {
      width: drawerWidth
    },
    menuItem: {
      width: drawerWidth
    },
    menuItemIcon: {
      color: theme.palette.primary.main,
    }
  })
);

export default AppMenu;
