import { Ref, ReactiveDep } from './reactivity';
type ComputedFun<T = any> = () => T;
type ComputedAsyncFun<T = any> = () => Promise<T>;
export declare const computed: <T = any>(fun: ComputedFun<T>, deps?: ReactiveDep[]) => Ref<T>;
type ComputedAsyncStatus = "idle" | "pending" | "error" | "resolved";
export declare const computedAsync: <T = any>(fun: ComputedAsyncFun<T>, deps?: ReactiveDep[]) => {
    data: Ref<T | null>;
    status: Ref<ComputedAsyncStatus>;
    refresh: () => Promise<void>;
};
export {};
