import { MaybeRef, RawRef, Ref } from "./ref";
import { MaybeSignal } from "./signal";
export type EffectSubscriber<T = any> = {
    onGet?: (target: RawRef<T>, key: keyof RawRef<T>, receiver: any) => any;
    onSet?: (target: RawRef<T>, key: keyof RawRef<T>, next: RawRef<T>[keyof RawRef<T>], receiver: any) => any;
    onTrigger?: () => any;
    lastValue?: any;
};
export type ReactiveDep<T = any> = Ref<T> | MaybeRef<T> | MaybeSignal<T> | (() => T) | (() => any);
export declare const unwrapReactiveDep: <T = any>(dep: ReactiveDep<T>) => MaybeRef<T> | MaybeSignal<T>;
