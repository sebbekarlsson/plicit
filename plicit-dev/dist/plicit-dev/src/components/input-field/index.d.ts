import { Component } from "plicit";
import { IFormFieldProps } from "../form/types";
type InputFieldProps = IFormFieldProps & {
    onChange?: (x: string | number | null | undefined) => void;
};
export declare const InputField: Component<InputFieldProps>;
export {};
