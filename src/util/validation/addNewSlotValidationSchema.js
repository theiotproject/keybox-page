import * as yup from "yup";

export const addNewSlotValidationSchema = yup
  .object({
    slotId: yup.string().required("Slot Id field is required"),
    slotName: yup.string().required("Slot Name field is required"),
  })
  .required();
