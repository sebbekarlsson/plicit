import { Component, MaybeSignal } from "plicit";
import { InternalToast } from "./hook";
type ToastProps = {
    toast: MaybeSignal<InternalToast>;
};
export declare const Toast: Component<ToastProps>;
export {};
