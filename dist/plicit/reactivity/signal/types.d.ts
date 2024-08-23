import { ESignalState } from "./constants";
export type SignalEventPayload = {};
export type TrackerFlags = {
    isEffect: boolean;
    isComputed: boolean;
};
export type SignalOptions = Partial<TrackerFlags> & {
    throttle?: number;
    debounce?: number;
    autoDiffCheck?: boolean;
    immediate?: boolean;
};
export type AsyncSignalOptions<T = any> = SignalOptions & {
    fallback?: T;
    defer?: boolean;
};
export type SignalFunc<T = any> = () => T;
export type SignalFuncInit<T = any> = (signal: Signal<T>) => T;
export type SignalFuncAsync<T = any> = () => Promise<T>;
export type SignalFuncInitAsync<T = any> = (signal: AsyncSignal<T>) => Promise<T>;
export type SignalSetter<T = any> = ((old: T) => T) | T;
export type Trackable = {
    trigger: () => any;
    tracked: Trackable[];
    trackedEffects: Array<() => any>;
    watchers: Array<(x: any) => any>;
    isEffect?: boolean;
    isComputed?: boolean;
};
export type Signal<T = any> = Trackable & {
    state: ESignalState;
    fun?: SignalFunc<T>;
    _value?: T;
    _link?: Signal<T>;
    set: (fun: SignalSetter<T>) => void;
    get: () => T;
    peek: () => T;
    trigger: () => void;
    sym: "Signal";
};
export type AsyncSignal<T = any> = Omit<Signal<T>, "fun" | "set" | "sym" | "peek"> & {
    sym: "AsyncSignal";
    fun?: SignalFuncAsync<T>;
    fallback?: T;
    set: (fun: ((old: T) => T | Promise<T>) | T) => Promise<void>;
};
export type MaybeSignal<T = any> = T | Signal<T>;
export type MaybeAsyncSignal<T = any> = T | AsyncSignal<T>;
