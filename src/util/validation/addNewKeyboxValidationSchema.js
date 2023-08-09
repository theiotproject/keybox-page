import * as yup from "yup";

export const addNewKeyboxValidationSchema = yup
  .object({
    keyboxId: yup.string().required("Keybox Id field is required"),
    keyboxName: yup.string().required("Keybox Name field is required"),
  })
  .required();
