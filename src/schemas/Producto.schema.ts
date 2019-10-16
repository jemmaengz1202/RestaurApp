import * as yup from 'yup';

export const productoSchema = yup.object().shape({
  nombre: yup.string().required('El elemento es requerido'),
  precio: yup
    .number()
    .min(0.5, 'El precio debe de ser mayor a 0')
    .required('El elemento es requerido'),
  descripcion: yup.string().required('El elemento es requerido'),
  imagenUrl: yup
    .string()
    .nullable()
    .notRequired(),
  categoriaId: yup
    .number()
    .required('El elemento es requerido')
    .nullable()
});
