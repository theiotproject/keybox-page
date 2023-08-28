import * as yup from "yup";

export const editCardValidationSchema = yup
  .object({
    cardId: yup.string().required("Card Id field is required"),
    cardName: yup.string().required("Card Name field is required"),
  })
  .required();
