import { isSignal } from "./signal";
import { AsyncSignal, type Signal } from "./types";

export type WatchSignalOptions = {
  immediate?: boolean;
  deep?: boolean;
};

export const watchSignal = <T = any>(
  sig: Signal<T>,
  fun: (nextValue: T) => any,
  options: WatchSignalOptions = {},
) => {
  if (!sig.watchers.includes(fun)) {
    sig.watchers.push(fun);
  }

  if (options.immediate) {
    fun(sig._value);
  }

  const unsubscribeFuns: Array<() => void> = [];

  if (options.deep) {
    for (const tracked of sig.tracked) {
      if (isSignal(tracked)) {
        unsubscribeFuns.push(watchSignal(tracked, fun, options));
      }
    }
  }

  return () => {
    sig.watchers = sig.watchers.filter((it) => it !== fun);
    unsubscribeFuns.forEach((unsub) => unsub());
  };
};

export const watchAsyncSignal = <T = any>(
  sig: AsyncSignal<T>,
  fun: (nextValue: T) => any,
  options: WatchSignalOptions = {},
) => {
  if (!sig.watchers.includes(fun)) {
    sig.watchers.push(fun);
  }

  if (options.immediate) {
    fun(sig._value);
  }

  const unsubscribeFuns: Array<() => void> = [];

  if (options.deep) {
    for (const tracked of sig.tracked) {
      if (isSignal(tracked)) {
        unsubscribeFuns.push(watchSignal(tracked, fun, options));
      }
    }
  }

  return () => {
    sig.watchers = sig.watchers.filter((it) => it !== fun);
    unsubscribeFuns.forEach((unsub) => unsub());
  };
};
