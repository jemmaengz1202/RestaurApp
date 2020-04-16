import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { GeneralContext } from "./contexts/GeneralContext";
import { getUser } from "./api";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import Productos from "./pages/Productos";
import Index from "./pages/Index";
import ProductosList from "./components/ProductosList";
import Producto from "./pages/Producto";
import Usuarios from "./pages/Usuarios";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Mesas from "./pages/Mesas";
import Ordenes from "./pages/Ordenes";
import Reporte from "./pages/Reporte";

export const AppRouter = () => {
  const { signIn } = useContext(GeneralContext);

  useEffect(
    function checkLoginStatus() {
      const asyncFunction = async () => {
        try {
          const res = await getUser();

          if (res.status === 200) {
            signIn(res.data);
          }
        } catch (err) {
          console.log("No está autenticado");
        }
      };
      asyncFunction();
    },
    [signIn]
  );

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/productos" component={Productos} />
          <Route exact path="/productos/:idprod" component={Producto} />
          <Route exact path="/categorias" component={Categorias} />
          <Route exact path="/clientes" component={Clientes} />
          <Route exact path="/ordenes" component={Ordenes} />
          <Route exact path="/mesas" component={Mesas} />
          <Route exact path="/usuarios" component={Usuarios} />
          <Route exact path="/reporte" component={Reporte} />
          <Route path="/productos/categoria/:idcat" component={ProductosList} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signout" component={SignOut} />
        </Switch>
      </Layout>
    </Router>
  );
};
