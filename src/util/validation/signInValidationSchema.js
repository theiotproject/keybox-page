import * as yup from "yup";

export const signInValidationSchema = yup
  .object({
    email: yup.string().required("Email field is required").email(),
    password: yup.string().required("Password field is required"),
  })
  .required();
