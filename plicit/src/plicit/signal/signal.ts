import { EventEmitter, PlicitEvent } from "../event";
import { proxy } from "../proxy";
import { stringGenerator } from "../utils";
import { ESignalState } from "./constants";
import { ESignalEvent } from "./event";

let stack: Signal[] = [];
const uidGen = stringGenerator();

export type SignalOptions = {
  isEffect?: boolean;
  isComputed?: boolean;
}

type Fun<T = any> = () => T;

export type SignalEventPayload = {}

export type Signal<T = any> = {
  uid: string;
  node: SignalNode<T>;
  set: (fun: (old: T) => T) => void;
  get: () => T;
  peek: () => T;
  trigger: () => void;
  sym: "Signal";
  emitter: EventEmitter<SignalEventPayload, ESignalEvent, Signal<T>>;
};

export type SignalNode<T = any> = {
  parent?: Signal<any>;
  index: number;
  children: Signal[];
  tracked: Signal[];
  dependants: Signal[];
  state: ESignalState;
  fun?: Fun<T>;
  _value?: T;
};

export const isSignal = <T = any>(x: any): x is Signal<T> => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return x.sym === "Signal";
};

let trackedIds: string[] = [];

export type MaybeSignal<T = any> = T | Signal<T>;

export const signal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = {}
): Signal<T> => {

  const node: SignalNode<T> = proxy<SignalNode<T>>({
    index: -1,
    dependants: [],
    children: [],
    tracked: [],
    _value: null,
    fun: init,
    state: ESignalState.UNINITIALIZED,
    parent: undefined,
  });

  const emit = (event: Omit<PlicitEvent<SignalEventPayload, ESignalEvent, Signal>, 'target'>) => {
    sig.emitter.emit({...event, target: sig});
  }  

  const trigger = () => {
//    if (![ESignalState.DIRTY, ESignalState.UNINITIALIZED].includes(node.state)) return;
    
    emit({ type: ESignalEvent.TRIGGER, payload: {} })
    if (options.isEffect || options.isComputed) {
      trackedIds = [];

      emit({ type: ESignalEvent.BEFORE_UPDATE, payload: {} });
      const next = init();
      if (options.isComputed) {
        node._value = next;
      }
      emit({ type: ESignalEvent.AFTER_UPDATE, payload: {} });
      const trackedItems = stack.filter((it) => trackedIds.includes(it.uid));

      for (const tracked of trackedItems) {
        if (!node.tracked.includes(tracked)) {
          node.tracked.push(tracked);

          if (!tracked.node.dependants.includes(sig)) {
            tracked.node.dependants.push(sig);
          }
        }
      }

      trackedIds = [];
      return;
    } else {
      trackedIds = [];
      emit({ type: ESignalEvent.BEFORE_UPDATE, payload: {} });
      const next = init();
      if (options.isComputed) {
        node._value = next;
      }
      emit({ type: ESignalEvent.AFTER_UPDATE, payload: {} });
      const trackedItems = stack.filter((it) => trackedIds.includes(it.uid));

      for (const tracked of trackedItems) {
        if (!node.tracked.includes(tracked)) {
          node.tracked.push(tracked);

          if (!tracked.node.dependants.includes(sig)) {
            tracked.node.dependants.push(sig);
          }
        }
      }
    }

    node.dependants.forEach((dep) => {
      dep.trigger();
      dep.node.state = ESignalState.DIRTY;
    });

    node.state = ESignalState.CLEAN;

  };

  const track = () => {
    trackedIds.push(sig.uid);
    emit({ type: ESignalEvent.TRACK, payload: {} })
  };

  const sig: Signal<T> = {
    emitter: new EventEmitter(),
    sym: "Signal",
    uid: uidGen.next(24),
    node,
    trigger,
    peek: () => node._value || init(),
    set: (fun: (old: T) => T) => {
      node._value = fun(node._value);
      node.state = ESignalState.DIRTY;
      trigger();
    },
    get: () => {
      if (node.state === ESignalState.UNINITIALIZED) {
        node._value = init();
        node.state = ESignalState.INITIALIZED;
      }
      track();
      return node._value;
    },
  };

  if (options.isEffect || options.isComputed) {
    trigger();
  }

  stack.push(sig);

  

  return sig;
};


export const computedSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isComputed: true }
): Signal<T> => signal<T>(init, options);

export const effectSignal = <T = any>(
  init: Fun<T>,
  options: SignalOptions = { isEffect: true }
): Signal<T> => signal<T>(init, options);
