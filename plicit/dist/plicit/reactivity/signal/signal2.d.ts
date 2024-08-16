import { Trackable } from "./types";
import { EventEmitter } from "../../event";
import { ESignalEvent } from "./event";
type Fun<T = any> = () => T;
export type Signal2EventPayload = {};
export type Signal2<T = any> = Trackable & {
    uid: string;
    _value: T;
    set: (fun: ((old: T) => T) | T) => void;
    get: () => T;
    peek: () => T;
    trigger: () => void;
    sym: "Signal";
    emitter: EventEmitter<Signal2EventPayload, ESignalEvent, Signal2<T>>;
    dispose: () => void;
};
export declare const signal2: <T = any>(init: Fun | T) => Signal2<T>;
export declare const createEffect: (fun: Fun) => void;
export {};
