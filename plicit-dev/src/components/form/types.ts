import { LNodeAttributes, MaybeSignal } from "plicit";
import { UseForm } from "./hooks/useForm";

export type FormPrimitive = string | number | boolean | undefined | null;

export type IFormProps = {
  hook: UseForm;
};

export const isFormPrimitive = (x: any): x is FormPrimitive => {
  return (
    typeof x === "string" ||
    typeof x === "number" ||
    typeof x === "undefined" ||
    typeof x === "boolean" ||
    x === null
  );
};

export type IFormFieldProps = Omit<LNodeAttributes, "value"> & {
  value: MaybeSignal<FormPrimitive>;
};
