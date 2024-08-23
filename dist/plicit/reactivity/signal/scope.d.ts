import { type Signal, type AsyncSignal } from "./types";
export type GlobalSignalState = {
    current: Signal | AsyncSignal | undefined;
    currentEffect: (() => any) | undefined;
    idCounter: number;
};
export declare const GSignal: GlobalSignalState;
export declare const withSignal: <T = any>(sig: Signal | AsyncSignal, fun: () => T) => T;
export declare const withAsyncSignal: <T = any>(sig: AsyncSignal, fun: () => T) => Promise<T>;
