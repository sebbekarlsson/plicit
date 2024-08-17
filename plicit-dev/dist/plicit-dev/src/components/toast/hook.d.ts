import { Ref } from "plicit";
import { ToastObject } from "./types";
import { UseInterpolation } from "../../hooks/useInterpolation";
type Timer = ReturnType<typeof setTimeout>;
export type InternalToast = ToastObject & {
    animation: UseInterpolation;
    uid: string;
    timer: Timer | null;
};
export type UseToasts = {
    push: (toast: ToastObject) => void;
    pop: (uid: string) => void;
    toasts: Ref<Ref<InternalToast>[]>;
    count: Ref<number>;
};
export declare const useToasts: () => UseToasts;
export {};
