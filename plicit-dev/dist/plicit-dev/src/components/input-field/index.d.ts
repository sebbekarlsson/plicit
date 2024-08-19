import { Component, LNodeAttributes, MaybeSignal } from "plicit";
type InputFieldProps = LNodeAttributes & {
    value: MaybeSignal<string>;
    onChange?: (x: string) => void;
};
export declare const InputField: Component<InputFieldProps>;
export {};
