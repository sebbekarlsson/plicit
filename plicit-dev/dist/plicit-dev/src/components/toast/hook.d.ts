import { Signal, UseInterpolation } from "plicit";
import { ToastObject } from "./types";
type Timer = ReturnType<typeof setTimeout>;
export type InternalToast = ToastObject & {
    animation: UseInterpolation;
    uid: string;
    timer: Timer | null;
};
export type UseToasts = {
    push: (toast: ToastObject) => void;
    pop: (uid: string) => void;
    toasts: Signal<Signal<InternalToast>[]>;
    count: Signal<number>;
};
export declare const useToasts: () => UseToasts;
export {};
