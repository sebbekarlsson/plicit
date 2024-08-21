import { isFunction } from "../../is";
import { debounce, throttle } from "../../utils";
import { ESignalState } from "./constants";
import { callTrackableFunction } from "./effect";
import { GSignal, withSignal } from "./scope";
import { type AsyncSignal, AsyncSignalOptions, SignalFuncAsync } from "./types";
import { canBeAutoDiffed } from "./utils";

export const isAsyncSignal = <T = any>(x: any): x is AsyncSignal<T> => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return x.sym === "AsyncSignal";
};

export const asyncSignal = <T = any>(
  initial: SignalFuncAsync<T> | T,
  options: AsyncSignalOptions<T> = {},
): AsyncSignal<T> => {
  const init = isFunction(initial) ? initial : async () => initial;


  const callInit = async () => {
    sig.state = ESignalState.LOADING;
    try {
      const ret = await init();
      sig.state = ESignalState.RESOLVED;
      return ret;
    } catch (e) {
      console.error(e);
      sig.state = ESignalState.ERROR;
    }
    return null;
  }

  const triggerFun = () => {
    const trig = async () => {
      if (options.isComputed) {
        sig._value = await callInit();
      } else {
        callInit();
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
    }
    trig().catch(e => console.error(e));
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

  const sig: AsyncSignal<T> = {
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    fallback: options.fallback,
    sym: "AsyncSignal",
    _value: isFunction(initial) ? null : initial,
    fun: callInit,
    state: ESignalState.UNINITIALIZED,
    trigger,
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {
      track();
      return sig._value || sig.fallback;
    },
    set: async (fun: ((old: T) => (T | Promise<T>)) | T) => {
      const nextValue = isFunction(fun) ? (await fun(sig._value)) : fun;
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
