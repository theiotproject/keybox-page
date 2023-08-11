import * as yup from "yup";

export const editCardValidationSchema = yup
  .object({
    cardId: yup.string(),
    cardName: yup.string().required("Card Name field is required"),
    authorizedSlots: yup
      .string()
      .matches(/^(\d+(,\s*\d+)*)?$/, "Invalid format")
      .required("Authorized slots field is required"),
  })
  .required();
