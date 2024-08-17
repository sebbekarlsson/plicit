import { MaybeRef } from "./ref";
import { MaybeSignal } from "./signal";
export declare const pget: <T = any>(x: MaybeRef<T> | MaybeSignal<T>) => T;
