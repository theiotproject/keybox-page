import * as yup from "yup";

export const editKeyboxValidationSchema = yup
  .object({
    keyboxName: yup.string().required("Device Name field is required"),
  })
  .required();
