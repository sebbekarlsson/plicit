import { AsyncSignal, type Signal } from './types';
export type WatchSignalOptions = {
    immediate?: boolean;
    deep?: boolean;
};
export declare const watchSignal: <T = any>(sig: Signal<T>, fun: (nextValue: T) => any, options?: WatchSignalOptions) => () => void;
export declare const watchAsyncSignal: <T = any>(sig: AsyncSignal<T>, fun: (nextValue: T) => any, options?: WatchSignalOptions) => () => void;
