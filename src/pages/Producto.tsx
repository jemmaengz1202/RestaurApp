import React, { useState } from "react";
import ProductoViewDialog from "../components/ProductoViewDialog";
import { useParams, useHistory } from "react-router";

export default function Producto() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { idprod } = useParams();

  return (
    <ProductoViewDialog
      handleClose={() => {
        setOpen(false);
        history.replace("/productos");
      }}
      idProducto={Number(idprod)}
      open={open}
    />
  );
}
