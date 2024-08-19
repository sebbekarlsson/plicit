import { Signal } from "plicit";
import { ToastObject } from "./types";
import { UseInterpolationSignal } from "../../hooks/useInterpolationSignal";
type Timer = ReturnType<typeof setTimeout>;
export type InternalToast = ToastObject & {
    animation: UseInterpolationSignal;
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
