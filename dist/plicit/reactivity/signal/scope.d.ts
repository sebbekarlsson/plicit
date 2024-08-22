import { type Signal, type AsyncSignal } from './types';
export type GlobalSignalState = {
    current: Signal | AsyncSignal | undefined;
    currentEffect: (() => any) | undefined;
    idCounter: number;
};
export declare const GSignal: GlobalSignalState;
export declare const withSignal: (sig: Signal | AsyncSignal, fun: () => any) => void;
