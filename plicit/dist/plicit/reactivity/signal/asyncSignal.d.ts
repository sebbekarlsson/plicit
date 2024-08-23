import { type AsyncSignal, AsyncSignalOptions, SignalFuncInitAsync } from "./types";
export declare const isAsyncSignal: <T = any>(x: any) => x is AsyncSignal<T>;
export declare const asyncSignal: <T = any>(initial: SignalFuncInitAsync<T> | T, options?: AsyncSignalOptions<T>) => AsyncSignal<T>;
