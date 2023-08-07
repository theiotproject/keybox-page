import * as yup from "yup";

export const addNewKeyboxValidationSchema = yup
  .object({
    keyboxId: yup.string().required("Device ID field is required"),
    keyboxName: yup.string().required("Device Name field is required"),
  })
  .required();
