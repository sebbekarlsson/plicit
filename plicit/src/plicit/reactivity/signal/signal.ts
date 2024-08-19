import { isFunction } from "../../is";
import { debounce, throttle } from "../../utils";
import { ESignalState } from "./constants";
import { Trackable } from "./types";

export type GlobalSignalState = {
  current: Signal | undefined;
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

export type SignalOptions = {
  isEffect?: boolean;
  isComputed?: boolean;
  throttle?: number;
  debounce?: number;
  autoDiffCheck?: boolean;
  immediate?: boolean;
};

type Fun<T = any> = () => T;
type AsyncFun<T = any> = () => Promise<T>;

export type SignalEventPayload = {};

export type Signal<T = any> = Trackable & {
  node: SignalNode<T>;
  set: (fun: ((old: T) => T) | T) => void;
  get: () => T;
  peek: () => T;
  trigger: () => void;
  sym: "Signal";
};

export type SignalNode<T = any> = {
  state: ESignalState;
  fun?: Fun<T>;
  _value?: T;
};

export const isSignal = <T = any>(x: any): x is Signal<T> => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return x.sym === "Signal";
};

export type MaybeSignal<T = any> = T | Signal<T>;

export const signal = <T = any>(
  initial: Fun<T> | T,
  options: SignalOptions = {},
): Signal<T> => {
  const init = isFunction(initial) ? initial : () => initial;

  const triggerFun = () => {
    if (options.isComputed) {
      sig.node._value = init();
    } else {
      init();
    }

    GSignal.current = undefined;

    sig.watchers.forEach((watcher) => {
      watcher(sig.node._value)
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

  const canBeAutoDiffed = (a: any, b: any): boolean => {
    return (typeof a !== 'object' && typeof b !== 'object');
  }

  const sig: Signal<T> = {
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    sym: "Signal",
    node: {
      _value: isFunction(initial) ? null : initial,
      fun: init,
      state: ESignalState.UNINITIALIZED,
    },
    trigger,
    peek: () => sig.node._value || init(),
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {
      if (
        sig.node.state === ESignalState.UNINITIALIZED ||
        sig.node._value === null
      ) {
        sig.node._value = init();
        sig.node.state = ESignalState.INITIALIZED;
      }
      track();
      return sig.node._value;
    },
    set: (fun: ((old: T) => T) | T) => {
      const nextValue = isFunction(fun) ? fun(sig.node._value) : fun;
      if ((options.autoDiffCheck !== false) && canBeAutoDiffed(sig.node._value, nextValue) && (nextValue === sig.node._value)) {
        return;
      }
      sig.node._value = nextValue;
      sig.node.state = ESignalState.DIRTY;
      trigger();
    },
  };

  GSignal.current = sig;
  GSignal.currentEffect = trigger;
  trigger();
  GSignal.currentEffect = undefined;
  GSignal.current = undefined;

  return sig;
};

export const computedSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isComputed: true },
): Signal<T> => signal<T>(init, { ...options, isComputed: true });


type Unpromise<T = any> = Awaited<T>;


export type ComputedAsyncSignalStatus = "idle" | "pending" | "error" | "resolved";
export const computedAsyncSignal = <T = any>(
  init: AsyncFun<T>,
  options: SignalOptions = { isComputed: true },
): { data: Signal<Unpromise<T> | undefined>, status: Signal<ComputedAsyncSignalStatus>, update: () => Promise<void> } => {
  const sig = signal<Unpromise<T> | undefined>(undefined);
  const status = signal<ComputedAsyncSignalStatus>('idle');

  const update = async () => {
    status.set('pending');
    try {
      const resp = await init();
      sig.set(resp);
      status.set('resolved');
    } catch (e) {
      console.error(e);
      status.set('error');
    }
  }

  const refresh = async () => {
    if (GSignal.current && !GSignal.current.trackedEffects.includes(update)) {
      GSignal.current.trackedEffects.push(update);
    }

    GSignal.currentEffect = update;
    update();
    GSignal.currentEffect = undefined;
  }

  if (options.immediate !== false) {
    refresh().catch(e => console.error(e));
  }

  return { data: sig, status, update: refresh };
} 

export const effectSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isEffect: true },
): Signal<T> => signal<T>(init, { ...options, isEffect: true });

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
    fun(sig.node._value);
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
