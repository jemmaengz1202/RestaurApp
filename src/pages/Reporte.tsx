import React, { useContext, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import useAxios from "@use-hooks/axios";
import { axiosInstance } from "../api";
import { GeneralContext } from "../contexts/GeneralContext";

export function ReporteAImprimir() {
  const { response, loading } = useAxios({
    axios: axiosInstance,
    url: `/ordenes/reporte`,
    method: "GET",
    trigger: [],
  });

  const rows = response ? response.data : null;

  if (loading || rows == null) return null;

  return (
    <Grid container justify="center">
      <Grid item>
        <Typography variant="h1" style={{ margin: 20 }}>
          Reporte de ventas
        </Typography>
        <Table style={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "left" }}>Fecha</TableCell>
              <TableCell style={{ textAlign: "left" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.fecha}>
                <TableCell>
                  {row.fecha
                    ? format(new Date(row.fecha), "dd 'de' MMMM 'del' yyyy", {
                        locale: es,
                      })
                    : "No agrupada"}
                </TableCell>
                <TableCell>${row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default function Reporte() {
  const { changeTitle } = useContext(GeneralContext);

  useEffect(() => {
    changeTitle("Reporte");
  }, [changeTitle]);

  return (
    <Grid container style={{ padding: 20 }}>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            var content = document.getElementById("divcontents") as any;
            const t = document.getElementById("ifmcontentstoprint") as any;
            var pri = t.contentWindow;
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
          }}
        >
          Imprimir reporte de ventas
        </Button>

        <div id="divcontents" style={{ width: "100%", textAlign: "left" }}>
          <ReporteAImprimir />
        </div>
        <iframe
          title="Reporte autogenerado"
          id="ifmcontentstoprint"
          style={{ height: 0, width: 0, position: "absolute" }}
        ></iframe>
      </Grid>
    </Grid>
  );
}
