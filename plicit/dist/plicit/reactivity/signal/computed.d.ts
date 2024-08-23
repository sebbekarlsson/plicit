import { SignalFunc, SignalFuncAsync, SignalOptions, type Signal } from "./types";
export declare const computedSignal: <T = any>(init: SignalFunc<T>, options?: SignalOptions) => Signal<T>;
type Unpromise<T = any> = Awaited<T>;
export type ComputedAsyncSignalStatus = "idle" | "pending" | "error" | "resolved";
export declare const computedAsyncSignal: <T = any>(init: SignalFuncAsync<T>, options?: SignalOptions) => {
    data: Signal<Unpromise<T> | undefined>;
    status: Signal<ComputedAsyncSignalStatus>;
    update: () => Promise<void>;
};
export {};
