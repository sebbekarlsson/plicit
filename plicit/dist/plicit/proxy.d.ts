import { Indexable, ReactiveDep } from "./types";
export type LProxy<T extends Indexable> = T;
type ProxySubscriber<T extends Indexable> = {
    get: (target: T, key: keyof T, receiver: any) => any;
    set: (target: T, key: keyof T, next: T[keyof T], receiver: any) => any;
};
export declare const proxy: <T extends Indexable>(initial: T, subscribers?: ProxySubscriber<T>[]) => LProxy<T>;
type RefState<T = any> = {
    subscribers: RefSubscriber<T>[];
};
export type EffectSubscriber<T = any> = {
    onGet?: (target: RawRef<T>, key: keyof RawRef<T>, receiver: any) => any;
    onSet?: (target: RawRef<T>, key: keyof RawRef<T>, next: RawRef<T>[keyof RawRef<T>], receiver: any) => any;
    lastValue?: any;
};
export type RefSubscriber<T = any> = EffectSubscriber<T>;
export type RawRef<T = any> = {
    value: T;
    _ref: "ref";
    _state: LProxy<RefState<T>>;
    _deps: ReactiveDep[];
    subscribe: (subscriber: RefSubscriber<T>) => () => void;
    trigger: (key: string) => void;
};
export type Ref<T = any> = LProxy<RawRef<T>>;
export type MaybeRef<T = any> = Ref<T> | T;
export declare const ref: <T = any>(initial: T) => Ref<T>;
export declare const isRef: <T = any>(x: any) => x is Ref<T>;
export declare const unref: <T = any>(x: T | Ref<T>) => T;
export {};
