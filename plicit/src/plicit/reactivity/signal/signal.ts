import { EventEmitter, PlicitEvent } from "../../event";
import { isFunction } from "../../is";
import { proxy } from "../proxy";
import {
  debounce,
  stringGenerator,
  StringGenerator,
  throttle,
} from "../../utils";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";
import { Trackable } from "./types";

const FLUSHING_ENABLED: boolean = true as boolean;

const STACK_CAPACITY = 512;

export type GlobalSignalState = {
  stack: Trackable[];
  lookup: Map<string, Trackable>;
  tracked: string[];
  trackedExternal: string[];
  uidGen: StringGenerator;
  current: Signal | undefined;
  idCounter: number;
  lastFlush: number;
};

// @ts-ignore
const oldG = window.GSignal as GlobalSignalState;

export const GSignal: GlobalSignalState = oldG || {
  stack: [],
  lookup: new Map<string, Trackable>(),
  tracked: [],
  trackedExternal: [],
  uidGen: stringGenerator(),
  current: undefined,
  idCounter: 0,
  lastFlush: -1,
};
// @ts-ignore
window.GSignal = GSignal;
const nextId = () => {
  const n = GSignal.idCounter;
  GSignal.idCounter = GSignal.idCounter + 1;
  return `${n}`;
};

const maybeResetStack = () => {
  if (GSignal.stack.length >= STACK_CAPACITY) {
    GSignal.stack = [];
  }
};

const pushToStack = (item: Trackable) => {
  if (GSignal.lookup.has(item.uid) || GSignal.stack.includes(item)) return;
  maybeResetStack();
  GSignal.stack.push(item);
  GSignal.lookup.set(item.uid, item);
};

const getTrackables = () => {
  const trackables: Trackable[] = [];
  const keys = [...GSignal.tracked, ...GSignal.trackedExternal];
  for (const key of keys) {
    const trackable = GSignal.lookup.get(key);
    if (!trackable) continue;
    trackables.push(trackable);
  }
  return trackables;
};

export const publishTrackable = (
  item: Omit<Trackable, "uid" | "createdAt" | "refCounter"> & { uid?: string },
) => {
  const current = GSignal.current;
  const uid = item.uid || nextId();
  const now = performance.now();
  const next: Trackable = { ...item, uid, createdAt: now, refCounter: 0 };
  if (!current) return next;

  if (!current.tracked.includes(next) && !next.dependants.includes(current)) {
    current.tracked.push(next);
    current.lastGet = performance.now();
    next.dependants.push(current);
  }

  pushToStack(next);

  return next;
};

export const notifyTrack = (uid: string) => {
  if (GSignal.trackedExternal.includes(uid)) return;
  GSignal.trackedExternal.push(uid);
};

const destroyTrackable = (track: Trackable) => {
  GSignal.lookup.delete(track.uid);
  track.tracked.forEach((it) => {
    if (it.dispose || it.onDispose) {
      destroyTrackable(it);
    }
  });
  track.tracked = [];

  track.dependants.forEach((dep) => {
    dep.tracked = dep.tracked.filter((it) => it !== track);
    dep.dependants = dep.dependants.filter((it) => it !== track);
    //dep.tracked.forEach((it) => {
    //  if (it.isTrash) {
    //    destroyTrackable(it);
    //  }
    //});
    //dep.dependants.forEach((it) => {
    //  if (it.isTrash) {
    //    destroyTrackable(it);
    //  }
    //})
  });
  track.dependants = [];
  if (track.onDispose) {
    track.onDispose();
  }
};

export const flushSignals = () => {
  if (!FLUSHING_ENABLED) return;

  const all = Array.from(GSignal.lookup.values());

  if (all.length <= 0) return;
  const now = performance.now();

  const timeSinceLast = now - GSignal.lastFlush;

  if (timeSinceLast < 1000 && GSignal.lastFlush >= 0) return;

  GSignal.lastFlush = now;

  const signalIsTrash = (trackable: Trackable) => {
    //const diffCreated = now - trackable.createdAt;
    //const diffSet = now - trackable.lastSet;
    //const diffGet = now - trackable.lastGet;

    if (trackable.lastGet > 0 && trackable.lastSet > 0) {
      const d = Math.abs(trackable.lastGet - trackable.lastSet);
      if (d > 8) return true;
    }
    if (
      trackable.dependants.length === 0 &&
      trackable.tracked.length === 0 &&
      trackable.watchers.length === 0
    )
      return true;
    if (trackable.isTrash == true) return true;
    if (trackable.refCounter > 0) return false;
    //if (diffCreated > 1000 && trackable.lastGet < 0) return true;
    //if (trackable.isTrash) return true;
    //if (trackable.lastSet < 0 || trackable.lastGet < 0) return false;

    //return diffSet > 60 && diffGet > 60;
  };

  const trash = all.filter((it) => signalIsTrash(it) === true);

  for (const tr of trash) {
    destroyTrackable(tr);
  }

  GSignal.stack = GSignal.stack.filter((it) => signalIsTrash(it) === false);

  maybeResetStack();
};

export const disposeAllSignals = () => {
  GSignal.stack.forEach((it) => (it.isTrash = true));
  flushSignals();
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

  const registerTracked = () => {
    const trackedItems = getTrackables();
    for (const tracked of trackedItems) {
      if (!sig.tracked.includes(tracked) && !tracked.dependants.includes(sig)) {
        sig.tracked.push(tracked);
        tracked.dependants.push(sig);
      }
    }
  };

  const triggerFun = () => {
    sig.refCounter += 1;
    emit({ type: ESignalEvent.TRIGGER, payload: {} });

    GSignal.tracked = [];

    if (options.isComputed) {
      withUpdateEvents(() => {
        node._value = init();
      });
    } else {
      withUpdateEvents(() => init());
    }

    registerTracked();

    GSignal.tracked = [];
    GSignal.trackedExternal = [];
    GSignal.current = undefined;

    sig.watchers.forEach((watcher) => watcher());

    if (options.isEffect) {
      return;
    }

    sig.dependants.forEach((dep) => {
      dep.trigger();
    });

    // node.state = ESignalState.CLEAN;
  };

  let unsubs: Array<() => void> = [];
  let watching: string[] = [];

  const track = () => {
    sig.refCounter -= 1;
    const current = GSignal.current;
    if (current && current !== sig && current.uid !== uid) {
      if (!current.tracked.includes(sig)) {
        current.tracked.push(sig);
      }
      if (isSignal(current) && !watching.includes(current.uid)) {
        watching.push(current.uid);
        for (const tracked of current.tracked) {
          if (isSignal(tracked)) {
            unsubs.push(
              watchSignal(tracked, () => {
                current.trigger();
              }),
            );
          }
        }
      }
    }
    GSignal.tracked.push(sig.uid);
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
    refCounter: 0,
    createdAt: now,
    isComputed: options.isComputed,
    isEffect: options.isEffect,
    emitter: new EventEmitter(),
    sym: "Signal",
    uid: uid,
    node,
    trigger,
    peek: () => node._value || init(),
    dependants: [],
    tracked: [],
    watchers: [],
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
    dispose: () => {
      if (FLUSHING_ENABLED) {
        queueMicrotask(() => {
          sig.isTrash = true;
          flushSignals();
          unsubs.forEach((unsub) => unsub());
          unsubs = [];
          watching = [];
          sig.emitter.clear();
        });
      } //
    },
    lastSet: -1,
    lastGet: -1,
  };

  if (options.isEffect || options.isComputed) {
    trigger();
  }

  if (!options.isEffect) {
    pushToStack(sig);
    GSignal.current = sig;
  }

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
