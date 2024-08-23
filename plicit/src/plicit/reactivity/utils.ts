import {
  isSignal,
  MaybeAsyncSignal,
  MaybeSignal,
  SignalSetter,
} from "./signal";
import { isAsyncSignal } from "./signal/asyncSignal";

export const pget = <T = any>(x: MaybeSignal<T> | MaybeAsyncSignal<T>): T => {
  if (isSignal(x)) return x.get();
  if (isAsyncSignal(x)) return x.get();
  return x;
};

export const pgetDeep = <T = any>(
  x: MaybeSignal<T> | MaybeAsyncSignal<T>,
): T => {
  if (isSignal(x)) return pgetDeep(x.get());
  if (isAsyncSignal(x)) return pgetDeep(x.get());
  return x;
};

export const pset = <T = any>(
  x: MaybeSignal<T>,
  set: SignalSetter<T>,
): void => {
  if (isSignal(x)) {
    x.set(set);
  }
};
