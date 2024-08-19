import { MaybeSignal } from "./signal";
export type ReactiveDep<T = any> = MaybeSignal<T> | (() => T) | (() => any);
export declare const unwrapReactiveDep: <T = any>(dep: ReactiveDep<T>) => MaybeSignal<T>;
