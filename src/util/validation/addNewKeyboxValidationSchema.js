import * as yup from "yup";

export const addNewKeyboxValidationSchema = yup
  .object({
    deviceId: yup.string().required("Device ID field is required"),
    deviceName: yup.string().required("Device Name field is required"),
  })
  .required();
