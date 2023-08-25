import * as yup from "yup";

export const addNewKeyboxValidationSchema = yup
  .object({
    keyboxId: yup
      .string()
      .required("Keybox Id field is required")
      .length(24, "Keybox Id you've provided is not in valid format"),
    keyboxName: yup.string().required("Keybox Name field is required"),
    keySlotName1: yup.string(),
    keySlotName2: yup
      .string()
      .test("unique", "Slot names must be unique", function (value) {
        return value !== this.parent.keySlotName1;
      }),
    keySlotName3: yup
      .string()
      .test("unique", "Slot names must be unique", function (value) {
        return (
          value !== this.parent.keySlotName1 &&
          value !== this.parent.keySlotName2
        );
      }),
  })
  .required();
