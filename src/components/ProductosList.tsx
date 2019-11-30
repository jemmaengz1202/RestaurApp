import { Grid } from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";
import ProductoCard from "./ProductoCard";
import Pagination from "material-ui-flat-pagination";
import useDebounce from "../hooks/useDebounce";
import ProductoViewDialog from "./ProductoViewDialog";

export default function ProductosList() {
  const { idcat } = useParams();
  const { search: searchTerm } = useContext(GeneralContext);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(1);
  const search = useDebounce(searchTerm, 500);

  useEffect(function changePageTo1() {
    setPage(1);
  }, [search, setPage]);


  const url = idcat
    ? `/categorias/${idcat}/productos?filter[include][categoria]&filter[where][q]=${
        search ? encodeURIComponent(search) : ""
      }`
    : `/productos?filter[include][categoria]&filter[where][q]=${
        search ? encodeURIComponent(search) : ""
      }&page=${page}`;

  const { response, loading } = useAxios({
    axios: axiosInstance,
    url,
    method: "GET",
    trigger: [search, page]
  });

  let productos;
  let metaData;

  if (idcat) {
    productos = response ? response.data : [];
  } else {
    productos = response ? response.data.data : [];
    metaData = response ? response.data.meta : null;
  }

  if (loading || productos === null) return <></>;

  return (
    <Grid container style={{ width: "100%" }}>
      <Grid item xs={12}>
        <Grid container justify="space-between" style={{ padding: 16 }}>
          {productos.map((producto: any) => (
            <Grid item xs={12} sm={4} key={producto.id}>
              <ProductoCard 
              producto={producto}
              handleClick={(id) => {
                setId(id);
                setOpen(true);
              }} 
              />
            </Grid>
          ))}
          {metaData && (
            <Grid item xs={12}>
              <Grid container justify="center">
                <Pagination
                  limit={9}
                  offset={page === 1 ? 0 : page * 9 - 1}
                  total={metaData.totalItemCount}
                  onClick={(e, offset) => setPage(offset === 0 ? 1 : offset / 9 + 1)}
                  size="large"
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <ProductoViewDialog 
        idProducto={id}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Grid>
  );
}
