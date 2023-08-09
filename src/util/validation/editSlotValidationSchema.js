import * as yup from "yup";

export const editSlotValidationSchema = yup
  .object({
    slotName: yup.string().required("Slot Name field is required"),
  })
  .required();
