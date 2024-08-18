import { EventEmitter, PlicitEvent } from "../../event";
import { isFunction } from "../../is";
import { debounce, throttle } from "../../utils";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";
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
const nextId = () => {
  const n = GSignal.idCounter;
  GSignal.idCounter = GSignal.idCounter + 1;
  return `${n}`;
};

export type SignalOptions = {
  isEffect?: boolean;
  isComputed?: boolean;
  throttle?: number;
  debounce?: number;
  uid?: string;
};

type Fun<T = any> = () => T;

export type SignalEventPayload = {};

type Getter<T> = () => T;

export type Signal<T = any> = Trackable & {
  uid: string;
  node: SignalNode<T>;
  set: (fun: ((old: T) => T) | T) => void;
  get: Getter<T>;
  peek: () => T;
  trigger: () => void;
  sym: "Signal";
  emitter: EventEmitter<SignalEventPayload, ESignalEvent, Signal<T>>;
  wrapGetWith: (fun: (get: Getter<T>) => T) => void;
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
  const uid = options.uid || nextId();
  const init = isFunction(initial) ? initial : () => initial;

  //const node: SignalNode<T> = ;

  const emit = (
    event: Omit<
      PlicitEvent<SignalEventPayload, ESignalEvent, Signal>,
      "target"
    >,
  ) => {
    sig.emitter.emit({ ...event, target: sig });
  };

  const withUpdateEvents = (fn: () => void) => {
    emit({ type: ESignalEvent.BEFORE_UPDATE, payload: {} });
    fn();
    emit({ type: ESignalEvent.AFTER_UPDATE, payload: {} });
  };

  const triggerFun = () => {
    emit({ type: ESignalEvent.TRIGGER, payload: {} });

    if (options.isComputed) {
      withUpdateEvents(() => {
        sig.node._value = init();
      });
    } else {
      withUpdateEvents(() => init());
    }

    GSignal.current = undefined;

    sig.watchers.forEach((watcher) => watcher(sig.node._value));

    if (options.isEffect) {
      return;
    }

    sig.trackedEffects.forEach((fx) => fx());
  };

  let unsubs: Array<() => void> = [];

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

    emit({ type: ESignalEvent.TRACK, payload: {} });
  };

  let trigger = triggerFun;
  if (typeof options.debounce === "number") {
    trigger = debounce(trigger, options.debounce);
  }

  if (typeof options.throttle === "number") {
    const [fn] = throttle(trigger, options.throttle);
    trigger = fn;
  }

  let wrapper: ((get: Getter<T>) => T) | null = null;

  const sig: Signal<T> = {
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    emitter: new EventEmitter(),
    wrapGetWith: (wrapFun) => {
      wrapper = wrapFun;
    },
    sym: "Signal",
    uid: uid,
    node: ({
      _value: isFunction(initial) ? null : initial,
      fun: init,
      state: ESignalState.UNINITIALIZED,
    }),
    trigger,
    peek: () => sig.node._value || init(),
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {

      const _get = () => {
        if (sig.node.state === ESignalState.UNINITIALIZED || sig.node._value === null) {
          //        trigger();
          sig.node._value = init();
          sig.node.state = ESignalState.INITIALIZED;
        }
        track();
        return sig.node._value;
      }

      if (wrapper) {
        return wrapper(_get);
      }

      return _get();
    },
    set: (fun: ((old: T) => T) | T) => {
      const oldValue = sig.node._value;
      const nextValue = isFunction(fun) ? fun(sig.node._value) : fun;
      if (nextValue === oldValue) {
        return;
      }
      //

      sig.node._value = nextValue;
      sig.node.state = ESignalState.DIRTY;
      trigger();
    }
  };

  GSignal.current = sig;
  GSignal.currentEffect = trigger;
  trigger();
  GSignal.currentEffect = undefined;
  GSignal.current = undefined;

  // if (!options.isEffect) {
  //   pushToStack(sig);
  //   GSignal.current = sig;
  // }

  return sig;
};

export const computedSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isComputed: true },
): Signal<T> => signal<T>(init, { ...options, isComputed: true });

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
