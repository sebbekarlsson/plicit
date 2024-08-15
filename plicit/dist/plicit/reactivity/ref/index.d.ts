import { LProxy } from "../proxy";
import { ReactiveDep } from "../types";
import { EffectSubscriber } from "../types";
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
export type RefOptions = {
    deep?: boolean;
};
export declare const ref: <T = any>(initial: T, options?: RefOptions) => Ref<T>;
export declare const isRef: <T = any>(x: any) => x is Ref<T>;
export declare const unref: <T = any>(x: T | Ref<T>) => T;
type RefState<T = any> = {
    subscribers: RefSubscriber<T>[];
};
type EffectFun<T = any> = () => T;
export declare const watchRef: <T = any>(fun: EffectFun<T>, deps?: ReactiveDep[]) => void;
export {};
