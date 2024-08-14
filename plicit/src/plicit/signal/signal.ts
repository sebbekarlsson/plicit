import { EventEmitter, PlicitEvent } from "../event";
import { isFunction } from "../is";
import { proxy } from "../proxy";
import { StringGenerator, stringGenerator } from "../utils";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";
import { Trackable } from "./types";

export type GlobalSignalState = {
  stack: Trackable[];
  lookup: Map<string, Trackable>;
  tracked: string[];
  uidGen: StringGenerator;
};

export const GSignal: GlobalSignalState = {
  stack: [],
  lookup: new Map<string, Trackable>(),
  tracked: [],
  uidGen: stringGenerator(),
};

const pushToStack = (item: Trackable) => {
  GSignal.lookup.set(item.uid, item);
  GSignal.stack.push(item);
};

const getTrackables = () => {
  const trackables: Trackable[] = [];
  for (const key of GSignal.tracked) {
    const trackable = GSignal.lookup.get(key);
    if (!trackable) continue;
    trackables.push(trackable);
  }
  return trackables;
};

export const publishTrackable = (item: Omit<Trackable, "uid">) => {
  const next = { ...item, uid: GSignal.uidGen.next(24) };
  pushToStack(next);
  return next;
};

export const notifyTrack = (uid: string) => {
  if (GSignal.tracked.includes(uid)) return;
  GSignal.tracked.push(uid);
};

export const flushSignals = () => {
  const now = performance.now();

  const signalIsTrash = (trackable: Trackable) => {
    if (trackable.lastSet < 0 || trackable.lastGet < 0) return;
    const diffSet = now - trackable.lastSet;
    const diffGet = now - trackable.lastGet;
    return (diffSet > 60 && diffGet > 60);
  }

  const trash = GSignal.stack.filter(it => signalIsTrash(it) === true);

  for (const tr of trash) {
    GSignal.lookup.delete(tr.uid);
  }

  GSignal.stack = GSignal.stack.filter(it => signalIsTrash(it) === false)
}

export type SignalOptions = {
  isEffect?: boolean;
  isComputed?: boolean;
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
  }

  const registerTracked = () => {
    const trackedItems = getTrackables();
    for (const tracked of trackedItems) {
      if (!sig.tracked.includes(tracked)) {
        sig.tracked.push(tracked);
        if (!tracked.dependants.includes(sig)) {
          tracked.dependants.push(sig);
        }
      }
    }

    GSignal.tracked = [];
  }

  const triggerMutation = () => {
    GSignal.tracked = [];

    withUpdateEvents(() => {
      node._value = init();
    });
    
    registerTracked();
  };

  const triggerEffect = () => {
    GSignal.tracked = [];

    withUpdateEvents(() => init());
    
    registerTracked();
  };

  const trigger = () => {
    emit({ type: ESignalEvent.TRIGGER, payload: {} });

    if (options.isComputed) {
      triggerMutation();
    } else {
      triggerEffect();
    }
    
    sig.watchers.forEach((watcher) => watcher());

    if (options.isEffect || options.isComputed) {
      return;
    }

    sig.dependants.forEach((dep) => {
      dep.trigger();
    });

    node.state = ESignalState.CLEAN;
  };

  const track = () => {
    GSignal.tracked.push(sig.uid);
    emit({ type: ESignalEvent.TRACK, payload: {} });
  };

  const uid = GSignal.uidGen.next(24);

  const sig: Signal<T> = {
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
      node._value = isFunction(fun) ? fun(node._value) : fun;
      node.state = ESignalState.DIRTY;
      trigger();

      queueMicrotask(() => {
        sig.lastSet = performance.now();
      })
    },
    get: () => {
      if (node.state === ESignalState.UNINITIALIZED || node._value === null) {
        node._value = init();
        node.state = ESignalState.INITIALIZED;
      }
      track();
      queueMicrotask(() => {
        sig.lastGet = performance.now();
      })
      return node._value;
    },
    dispose: () => {
      queueMicrotask(() => {
        flushSignals();
        GSignal.stack = GSignal.stack.filter((it) => it.uid !== uid);
      })
    },
    lastSet: -1,
    lastGet: -1
  };

  if (options.isEffect || options.isComputed) {
    trigger();
  }

  if (!options.isEffect) {
    pushToStack(sig);
  }

  return sig;
};

export const computedSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isComputed: true },
): Signal<T> => signal<T>(init, options);

export const effectSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isEffect: true },
): Signal<T> => signal<T>(init, options);

export const watchSignal = <T = any>(sig: Signal<T>, fun: () => any) => {
  if (!sig.watchers.includes(fun)) {
    sig.watchers.push(fun);
  }

  return () => {
    sig.watchers = sig.watchers.filter((it) => it !== fun);
  };
};
