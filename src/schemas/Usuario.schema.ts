import * as yup from "yup";

export const usuarioSchema = yup.object().shape({
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
});
