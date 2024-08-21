import { type AsyncSignal, AsyncSignalOptions, SignalFuncAsync } from "./types";
export declare const isAsyncSignal: <T = any>(x: any) => x is AsyncSignal<T>;
export declare const asyncSignal: <T = any>(initial: SignalFuncAsync<T> | T, options?: AsyncSignalOptions<T>) => AsyncSignal<T>;
