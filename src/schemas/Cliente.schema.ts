import { axiosInstance } from "./../api";
import * as yup from "yup";
import adb from "awesome-debounce-promise";

const isUniqueRfc = adb(async value => {
  try {
    const res = await axiosInstance({
      url: `/clientes?filter[where][rfc]=${encodeURIComponent(value)}`,
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
  direccion: yup.string().required("El elemento es requerido"),
  colonia: yup.string().required("El elemento es requerido"),
  ciudad: yup.string().required("El elemento es requerido"),
  cp: yup
    .string()
    .required("El elemento es requerido")
    .test("len", "Debe haber 5 caracteres", val => val && val.length === 5),
  rfc: yup
    .string()
    .required("El elemento es requerido")
    .test(
      "unique_rfc",
      "Ya hay un cliente registrado con este RFC",
      isUniqueRfc
    )
    .matches(/^[a-zA-Z]{3,4}(\d{6})((\D|\d){2,3})?$/, "Ingrese un RFC válido")
};

export const clienteSchema = yup.object().shape(shape);

const editShape = {
  nombre: yup.string().required("El elemento es requerido"),
  direccion: yup.string().required("El elemento es requerido"),
  colonia: yup.string().required("El elemento es requerido"),
  ciudad: yup.string().required("El elemento es requerido"),
  cp: yup
    .string()
    .required("El elemento es requerido")
    .test("len", "Debe haber 5 caracteres", val => val && val.length === 5),
  rfc: yup
    .string()
    .required("El elemento es requerido")
    .matches(/^[a-zA-Z]{3,4}(\d{6})((\D|\d){2,3})?$/, "Ingrese un RFC válido")
};

export const editClienteSchema = yup.object().shape(editShape);
