import { isFunction } from "../../is";
import { debounce, throttle } from "../../utils";
import { isAsyncSignal } from "./asyncSignal";
import { ESignalState } from "./constants";
import { callTrackableFunction } from "./effect";
import { GSignal, withSignal } from "./scope";
import {
  AsyncSignal,
  SignalFuncInit,
  SignalOptions,
  Trackable,
  type Signal,
} from "./types";
import { canBeAutoDiffed } from "./utils";

export const isSignal = <T = any>(x: any): x is Signal<T> => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return x.sym === "Signal";
};

const findAsyncSignal = (track: Trackable): AsyncSignal | null => {
  if (isAsyncSignal(track)) return track;
  for (const b of track.tracked) {
    const sig = findAsyncSignal(b);
    if (sig) return sig;
  }

  return null;
};

export const signal = <T = any>(
  initial: SignalFuncInit<T> | T,
  options: SignalOptions = {},
): Signal<T> => {
  const init = isFunction(initial) ? initial : () => initial;

  const triggerFun = () => {
    if (options.isComputed) {
      const oldValue = sig._value;
      sig._value = init(sig);
      if (sig._value === oldValue) {
        GSignal.current = undefined;
        return;
      }
    } else {
      init(sig);
    }

    GSignal.current = undefined;

    sig.watchers.forEach((watcher) => {
      watcher(sig._value);
    });

    if (options.isEffect) {
      return;
    }

    sig.trackedEffects.forEach((fx) => {
      fx();
    });

    sig.tracked.forEach(async (it) => {
      if (
        isAsyncSignal(it) &&
        it.state !== ESignalState.LOADING &&
        it.state !== ESignalState.UNINITIALIZED
      ) {
        await it.trigger();
      }
    });
  };

  const track = () => {
    const current = GSignal.current;
    if (current && current !== sig && !sig.tracked.includes(current)) {
      sig.tracked.push(current);
    }
    if (
      GSignal.currentEffect &&
      !sig.trackedEffects.includes(GSignal.currentEffect) &&
      GSignal.currentEffect !== trigger
    ) {
      sig.trackedEffects.push(GSignal.currentEffect);
    }
  };

  let trigger = triggerFun;
  if (typeof options.debounce === "number") {
    trigger = debounce(trigger, options.debounce);
  }

  if (typeof options.throttle === "number") {
    const [fn] = throttle(trigger, options.throttle);
    trigger = fn;
  }

  const sig: Signal<T> = {
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    sym: "Signal",
    _value: isFunction(initial) ? null : initial,
    fun: () => init(sig),
    state: ESignalState.UNINITIALIZED,
    trigger,
    peek: () => sig._value || init(sig),
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {
      if (sig.state === ESignalState.UNINITIALIZED || sig._value === null) {
        sig._value = init(sig);
        sig.state = ESignalState.INITIALIZED;
      }
      track();
      return sig._value;
    },
    set: (fun: ((old: T) => T) | T) => {
      const nextValue = isFunction(fun) ? fun(sig._value) : fun;
      if (
        options.autoDiffCheck !== false &&
        canBeAutoDiffed(sig._value, nextValue) &&
        nextValue === sig._value
      ) {
        return;
      }
      sig._value = nextValue;
      sig.state = ESignalState.DIRTY;
      trigger();
    },
  };

  withSignal(sig, () => {
    callTrackableFunction(trigger);
  });

  return sig;
};
