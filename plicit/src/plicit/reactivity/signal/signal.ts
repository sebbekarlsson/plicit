import { isFunction } from "../../is";
import { debounce, throttle } from "../../utils";
import { ESignalState } from "./constants";
import { callTrackableFunction } from "./effect";
import { GSignal, withSignal } from "./scope";
import { SignalFunc, SignalOptions, type Signal } from "./types";
import { canBeAutoDiffed } from "./utils";

export const isSignal = <T = any>(x: any): x is Signal<T> => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return x.sym === "Signal";
};

export const signal = <T = any>(
  initial: SignalFunc<T> | T,
  options: SignalOptions = {},
): Signal<T> => {
  const init = isFunction(initial) ? initial : () => initial;

  const triggerFun = () => {
    if (options.isComputed) {
      sig._value = init();
    } else {
      init();
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
    fun: init,
    state: ESignalState.UNINITIALIZED,
    trigger,
    peek: () => sig._value || init(),
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {
      if (sig.state === ESignalState.UNINITIALIZED || sig._value === null) {
        sig._value = init();
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
