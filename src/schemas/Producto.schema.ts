import adb from "awesome-debounce-promise";
import * as yup from "yup";
import { axiosInstance } from "./../api";

const isUniqueNombre = adb(async value => {
  try {
    const res = await axiosInstance({
      url: `/productos?filter[where][nombre]=${encodeURIComponent(value)}`,
      method: "GET"
    });
    if (res.data.length === 0) {
      return true;
    }
    return false;
  } catch (err) {
    return true;
  }
}, 500);

const shape = {
  nombre: yup
    .string()
    .required("El elemento es requerido")
    .test(
      "unique_nombre",
      "Ya hay un producto registrado con ese nombre",
      isUniqueNombre
    ),
  precio: yup
    .number()
    .min(0.5, "El precio debe de ser mayor a 0")
    .required("El elemento es requerido"),
  descripcion: yup.string().required("El elemento es requerido"),
  imagenUrl: yup
    .string()
    .nullable()
    .notRequired(),
  categoriaId: yup
    .number()
    .required("El elemento es requerido")
    .nullable()
};

export const productoSchema = yup.object().shape(shape);

const editShape = {
  nombre: yup.string().required("El elemento es requerido"),
  precio: yup
    .number()
    .min(0.5, "El precio debe de ser mayor a 0")
    .required("El elemento es requerido"),
  descripcion: yup.string().required("El elemento es requerido"),
  imagenUrl: yup
    .string()
    .nullable()
    .notRequired(),
  categoriaId: yup
    .number()
    .required("El elemento es requerido")
    .nullable()
};

export const editProductoSchema = yup.object().shape(editShape);
