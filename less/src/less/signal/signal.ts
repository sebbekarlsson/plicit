import { proxy } from "../proxy";
import { stringGenerator } from "../utils";
import { ESignalState } from "./constants";

let stack: Signal[] = [];
const uidGen = stringGenerator();

type Fun<T = any> = () => T;

export type Signal<T = any> = {
  uid: string;
  node: SignalNode<T>;
  set: (fun: (old: T) => T) => void;
  get: () => T;
  trigger: () => void;
  sym: "Signal";
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

export const signal = <T = any>(
  init: Fun<T>,
  isEffect: boolean = false,
  isComputed: boolean = false
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

  const trigger = () => {
//    if (![ESignalState.DIRTY, ESignalState.UNINITIALIZED].includes(node.state)) return;
    
    if (isEffect) {
      trackedIds = [];
      init();
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
    }

    if (isComputed) {
      node._value = init();

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
    }

    node.dependants.forEach((dep) => {
      dep.trigger();
      dep.node.state = ESignalState.DIRTY;
    });

    node.state = ESignalState.CLEAN;

  };

  const track = () => {
    trackedIds.push(sig.uid);
  };

  const sig: Signal<T> = {
    sym: "Signal",
    uid: uidGen.next(24),
    node,
    trigger,
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

  if (isEffect || isComputed) {
    trigger();
  }

  stack.push(sig);

  

  return sig;
};
