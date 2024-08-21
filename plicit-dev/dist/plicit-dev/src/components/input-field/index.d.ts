import { Component, LNodeAttributes, MaybeSignal } from "plicit";
type InputFieldProps = LNodeAttributes & {
    value: MaybeSignal<string | number | null | undefined>;
    onChange?: (x: string | number | null | undefined) => void;
};
export declare const InputField: Component<InputFieldProps>;
export {};
