import { EventEmitter } from "../../event";
import { StringGenerator } from "../../utils";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";
import { Trackable } from "./types";
export type GlobalSignalState = {
    stack: Trackable[];
    lookup: Map<string, Trackable>;
    tracked: string[];
    trackedExternal: string[];
    uidGen: StringGenerator;
    current: Signal | undefined;
    idCounter: number;
    lastFlush: number;
};
export declare const GSignal: GlobalSignalState;
export declare const publishTrackable: (item: Omit<Trackable, "uid" | "createdAt" | "refCounter"> & {
    uid?: string;
}) => Trackable;
export declare const notifyTrack: (uid: string) => void;
export declare const flushSignals: () => void;
export declare const disposeAllSignals: () => void;
export type SignalOptions = {
    isEffect?: boolean;
    isComputed?: boolean;
    throttle?: number;
    debounce?: number;
    uid?: string;
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
    emitter: EventEmitter<SignalEventPayload, ESignalEvent, Signal<T>>;
    dispose: () => void;
};
export type SignalNode<T = any> = {
    index: number;
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
export declare const watchSignal: <T = any>(sig: Signal<T>, fun: () => any, options?: WatchSignalOptions) => () => void;
export {};
