import { Component, MaybeRef } from "plicit";
import { InternalToast } from "./hook";
type ToastProps = {
    toast: MaybeRef<InternalToast>;
};
export declare const Toast: Component<ToastProps>;
export {};
