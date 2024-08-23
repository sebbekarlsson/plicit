import { type Signal, type AsyncSignal } from "./types";

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

export const withSignal = <T = any>(
  sig: Signal | AsyncSignal,
  fun: () => T,
): T => {
  GSignal.current = sig;
  const ret = fun();
  GSignal.current = undefined;
  return ret;
};

export const withAsyncSignal = async <T = any>(
  sig: AsyncSignal,
  fun: () => T,
): Promise<T> => {
  GSignal.current = sig;
  const ret = await fun();
  GSignal.current = undefined;
  return ret;
};
