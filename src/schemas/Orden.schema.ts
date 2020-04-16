import * as yup from "yup";

const shape = {
  mesa: yup.boolean().default(true),
};

export const ordenSchema = yup.object().shape(shape);
