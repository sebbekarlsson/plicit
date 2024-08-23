import { SignalFuncInit, SignalOptions, type Signal } from "./types";
export declare const isSignal: <T = any>(x: any) => x is Signal<T>;
export declare const signal: <T = any>(initial: SignalFuncInit<T> | T, options?: SignalOptions) => Signal<T>;
