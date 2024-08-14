import { EventEmitter } from "../event";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";
export type SignalOptions = {
    isEffect?: boolean;
    isComputed?: boolean;
};
type Fun<T = any> = () => T;
export type SignalEventPayload = {};
export type Signal<T = any> = {
    uid: string;
    node: SignalNode<T>;
    set: (fun: (old: T) => T) => void;
    get: () => T;
    peek: () => T;
    trigger: () => void;
    sym: "Signal";
    emitter: EventEmitter<SignalEventPayload, ESignalEvent, Signal<T>>;
};
export type SignalNode<T = any> = {
    parent?: Signal<any>;
    index: number;
    children: Signal[];
    tracked: Signal[];
    dependants: Signal[];
    state: ESignalState;
    fun?: Fun<T>;
    _value?: T;
};
export declare const isSignal: <T = any>(x: any) => x is Signal<T>;
export type MaybeSignal<T = any> = T | Signal<T>;
export declare const signal: <T = any>(initial: Fun<T> | T, options?: SignalOptions) => Signal<T>;
export declare const computedSignal: <T = any>(init: Fun<T>, options?: SignalOptions) => Signal<T>;
export declare const effectSignal: <T = any>(init: Fun<T>, options?: SignalOptions) => Signal<T>;
export {};
