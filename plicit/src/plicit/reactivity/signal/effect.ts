import { GSignal } from "./scope";
import { signal } from "./signal";
import { SignalOptions, type Signal } from './types';

type Fun<T = any> = () => T;

export const effectSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isEffect: true },
): Signal<T> => signal<T>(init, { ...options, isEffect: true });



export const callTrackableFunction = (fun:  () => any) => {
  GSignal.currentEffect = fun;
  fun();
  GSignal.currentEffect = undefined;
}
