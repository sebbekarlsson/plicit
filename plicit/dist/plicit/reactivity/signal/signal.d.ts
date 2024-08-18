import { ESignalState } from "./constants";
import { Trackable } from "./types";
export type GlobalSignalState = {
    current: Signal | undefined;
    currentEffect: (() => any) | undefined;
    idCounter: number;
};
export declare const GSignal: GlobalSignalState;
export type SignalOptions = {
    isEffect?: boolean;
    isComputed?: boolean;
    throttle?: number;
    debounce?: number;
    uid?: string;
    autoDiffCheck?: boolean;
};
type Fun<T = any> = () => T;
export type SignalEventPayload = {};
export type Signal<T = any> = Trackable & {
    uid: string;
    node: SignalNode<T>;
    set: (fun: ((old: T) => T) | T) => void;
    get: () => T;
    peek: () => T;
    trigger: () => void;
    sym: "Signal";
};
export type SignalNode<T = any> = {
    state: ESignalState;
    fun?: Fun<T>;
    _value?: T;
};
export declare const isSignal: <T = any>(x: any) => x is Signal<T>;
export type MaybeSignal<T = any> = T | Signal<T>;
export declare const signal: <T = any>(initial: Fun<T> | T, options?: SignalOptions) => Signal<T>;
export declare const computedSignal: <T = any>(init: Fun<T>, options?: SignalOptions) => Signal<T>;
export declare const effectSignal: <T = any>(init: Fun<T>, options?: SignalOptions) => Signal<T>;
export type WatchSignalOptions = {
    immediate?: boolean;
    deep?: boolean;
};
export declare const watchSignal: <T = any>(sig: Signal<T>, fun: (nextValue: T) => any, options?: WatchSignalOptions) => () => void;
export {};
