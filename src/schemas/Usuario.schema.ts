import { axiosInstance } from "./../api";
import * as yup from "yup";
import adb from "awesome-debounce-promise";

const isUniqueUsername = adb(async value => {
  try {
    const res = await axiosInstance({
      url: `/usuarios?filter[where][username]=${encodeURIComponent(value)}`,
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
  nombre: yup.string().required("El elemento es requerido"),
  username: yup
    .string()
    .required("El elemento es requerido")
    .test(
      "unique_username",
      "Ya hay alguien usando este nombre de usuario",
      isUniqueUsername
    ),
  imagenUrl: yup
    .string()
    .nullable()
    .notRequired(),
  rolId: yup
    .number()
    .required("El elemento es requerido")
    .nullable(),
  password: yup
    .string()
    .nullable()
    .notRequired()
};

export const usuarioSchema = yup.object().shape(shape);

const editShape = {
  nombre: yup.string().required("El elemento es requerido"),
  username: yup.string().required("El elemento es requerido"),
  imagenUrl: yup
    .string()
    .nullable()
    .notRequired(),
  rolId: yup
    .number()
    .required("El elemento es requerido")
    .nullable(),
  password: yup
    .string()
    .nullable()
    .notRequired()
};

export const editUsuarioSchema = yup.object().shape(editShape);
