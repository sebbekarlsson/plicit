import { GSignal } from "./scope";
import { signal } from "./signal";
import { SignalOptions, type Signal } from "./types";

type Fun<T = any> = () => T;
type EffectFun = () => void;

export const effectSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isEffect: true },
): Signal<T> => signal<T>(init, { ...options, isEffect: true });

export const callTrackableFunction = <T = any>(fun: () => T): T => {
  GSignal.currentEffect = fun;
  const ret = fun();
  GSignal.currentEffect = undefined;
  return ret;
};

export const callTrackableAsyncFunction = async <T = any>(
  fun: () => T,
): Promise<T> => {
  GSignal.currentEffect = fun;
  const ret = await fun();
  GSignal.currentEffect = undefined;
  return ret;
};

export const injectTrackableFunction = <T = any>(fun: () => T) => {
  if (GSignal.current) {
    GSignal.current.trackedEffects.push(fun);
  }
};

export const effect = (fun: EffectFun) => {
  callTrackableFunction(fun);
};
