import { type Signal, type AsyncSignal } from './types';

export type GlobalSignalState = {
  current: Signal | AsyncSignal | undefined;
  currentEffect: (() => any) | undefined;
  idCounter: number;
};

// @ts-ignore
const oldG = window.GSignal as GlobalSignalState;

export const GSignal: GlobalSignalState = oldG || {
  current: undefined,
  currentEffect: undefined,
  idCounter: 0,
};
// @ts-ignore
window.GSignal = GSignal;



export const withSignal = (sig: Signal | AsyncSignal, fun: () => any) => {
  GSignal.current = sig;
  fun();
  GSignal.current = undefined;
}
