import React, { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable, { Column } from "material-table";

type MyMaterialTableWithoutPagesProps = {
  data: object[];
  columns: Column<object>[] | any;
  tableRef: any;
  title: string;
  onEditClick: (rowData: object | object[] | any) => void;
  onDeleteClick: (rowData: object | object[]) => void;
};

export default function MyMaterialTableWithoutPages({
  data,
  columns,
  tableRef,
  title,
  onEditClick,
  onDeleteClick,
}: MyMaterialTableWithoutPagesProps) {
  return (
    <MaterialTable
      columns={columns}
      data={data}
      tableRef={tableRef}
      title={title}
      options={{
        search: false,
        pageSizeOptions: [],
        paging: false,
      }}
      actions={[
        {
          icon: "edit",
          tooltip: "Editar elemento",
          onClick: (_event, rowData) => onEditClick(rowData),
        },
        {
          icon: "delete",
          tooltip: "Eliminar elemento",
          onClick: (_event, rowData) => onDeleteClick(rowData),
        },
      ]}
      localization={{
        pagination: {
          labelDisplayedRows: "{from}-{to} de {count}",
          firstAriaLabel: "Primera página",
          firstTooltip: "Primera página",
          lastAriaLabel: "Última página",
          lastTooltip: "Última página",
          previousAriaLabel: "Página anterior",
          previousTooltip: "Página anterior",
          nextAriaLabel: "Página siguiente",
          nextTooltip: "Página siguiente",
        },
        toolbar: {
          nRowsSelected: "{0} filas(s) seleccionadas",
          searchTooltip: "Búsqueda",
          searchPlaceholder: "Búsqueda",
        },
        header: {
          actions: "Acciones",
        },
        body: {
          emptyDataSourceMessage: "No hay elementos para mostrar",
          filterRow: {
            filterTooltip: "Filtro",
          },
        },
      }}
      icons={{
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => (
          <DeleteOutline {...props} ref={ref} />
        )),
        DetailPanel: forwardRef((props, ref) => (
          <ChevronRight {...props} ref={ref} />
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => (
          <FirstPage {...props} ref={ref} />
        )),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => (
          <ChevronRight {...props} ref={ref} />
        )),
        PreviousPage: forwardRef((props, ref) => (
          <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => (
          <ArrowUpward {...props} ref={ref} />
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
          <Remove {...props} ref={ref} />
        )),
        ViewColumn: forwardRef((props, ref) => (
          <ViewColumn {...props} ref={ref} />
        )),
      }}
    />
  );
}
