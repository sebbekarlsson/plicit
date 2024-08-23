import { SignalOptions, type Signal } from './types';
type Fun<T = any> = () => T;
type EffectFun = () => void;
export declare const effectSignal: <T = any>(init: Fun<T>, options?: SignalOptions) => Signal<T>;
export declare const callTrackableFunction: <T = any>(fun: () => T) => T;
export declare const injectTrackableFunction: <T = any>(fun: () => T) => void;
export declare const effect: (fun: EffectFun) => void;
export {};
