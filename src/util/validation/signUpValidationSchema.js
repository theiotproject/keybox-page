import * as yup from "yup";

export const signUpValidationSchema = yup
  .object({
    firstName: yup.string().required("First Name field is required"),
    lastName: yup.string().required("Last Name field is required"),
    email: yup.string().required("Email field is required").email(),
    password: yup
      .string()
      .required("Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  })
  .required();
