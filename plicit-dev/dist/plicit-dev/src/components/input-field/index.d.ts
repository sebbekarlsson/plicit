import { Component, LNodeAttributes } from "plicit";
type InputFieldProps = LNodeAttributes & {
    value: string;
    onChange?: (x: string) => void;
};
export declare const InputField: Component<InputFieldProps>;
export {};
