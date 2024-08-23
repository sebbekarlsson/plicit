import { MaybeAsyncSignal, MaybeSignal, SignalSetter } from "./signal";
export declare const pget: <T = any>(x: MaybeSignal<T> | MaybeAsyncSignal<T>) => T;
export declare const pgetDeep: <T = any>(x: MaybeSignal<T> | MaybeAsyncSignal<T>) => T;
export declare const pset: <T = any>(x: MaybeSignal<T>, set: SignalSetter<T>) => void;
