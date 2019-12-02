import adb from "awesome-debounce-promise";
import * as yup from "yup";
import { axiosInstance } from "./../api";

const isUniqueMesa = adb(async value => {
  try {
    const res = await axiosInstance({
      url: `/mesas?filter[where][nombre]=${encodeURIComponent(value)}`,
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
  observaciones: yup
    .string()
    .notRequired()
    .nullable(),
  disponible: yup.boolean().default(true),
  nombre: yup
    .string()
    .required("El elemento es requerido")
    .test(
      "unique_mesa",
      "Ya hay una mesa registrada con este nombre",
      isUniqueMesa
    )
};

export const mesaSchema = yup.object().shape(shape);

const editShape = {
  observaciones: yup
    .string()
    .notRequired()
    .nullable(),
  disponible: yup.boolean().default(true),
  nombre: yup
    .string()
    .required("El elemento es requerido")
};

export const editMesaSchema = yup.object().shape(editShape);
