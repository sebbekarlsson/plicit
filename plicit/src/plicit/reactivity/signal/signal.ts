import { EventEmitter, PlicitEvent } from "../../event";
import { isFunction } from "../../is";
import { proxy } from "../proxy";
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

export type Signal<T = any> = Trackable & {
  uid: string;
  node: SignalNode<T>;
  set: (fun: ((old: T) => T) | T) => void;
  get: () => T;
  peek: () => T;
  trigger: () => void;
  sym: "Signal";
  emitter: EventEmitter<SignalEventPayload, ESignalEvent, Signal<T>>;
  dispose: () => void;
};

export type SignalNode<T = any> = {
  index: number;
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

  const node: SignalNode<T> = proxy<SignalNode<T>>({
    index: -1,
    _value: null,
    fun: init,
    state: ESignalState.UNINITIALIZED,
  });

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
        node._value = init();
      });
    } else {
      withUpdateEvents(() => init());
    }

    GSignal.current = undefined;

    sig.watchers.forEach((watcher) => watcher());

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

  const now = performance.now();

  const sig: Signal<T> = {
    createdAt: now,
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    emitter: new EventEmitter(),
    sym: "Signal",
    uid: uid,
    node,
    trigger,
    peek: () => node._value || init(),
    tracked: [],
    trackedEffects: [],
    watchers: [],
    get: () => {
      if (node.state === ESignalState.UNINITIALIZED || node._value === null) {
        //        trigger();
        node._value = init();
        node.state = ESignalState.INITIALIZED;
      }
      track();
      queueMicrotask(() => {
        sig.lastGet = performance.now();
      });
      return node._value;
    },
    set: (fun: ((old: T) => T) | T) => {
      //const oldValue = node._value;
      const nextValue = isFunction(fun) ? fun(node._value) : fun;
      //if (nextValue === oldValue) {
      //  return;
      //}
      //

      node._value = nextValue;
      node.state = ESignalState.DIRTY;
      trigger();

      queueMicrotask(() => {
        sig.lastSet = performance.now();
      });
    },
    dispose: () => {
      queueMicrotask(() => {
        sig.isTrash = true;
        unsubs.forEach((unsub) => unsub());
        unsubs = [];
        sig.emitter.clear();
      });
    },
    lastSet: -1,
    lastGet: -1,
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
  fun: () => any,
  options: WatchSignalOptions = {},
) => {
  if (!sig.watchers.includes(fun)) {
    sig.watchers.push(fun);
  }

  if (options.immediate) {
    fun();
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

//setInterval(() => {
//  console.log(GSignal);
//}, 1000);
