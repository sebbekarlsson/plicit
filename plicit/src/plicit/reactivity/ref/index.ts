import { LProxy, proxy } from "../proxy";
import { notNullish } from "../../types";
import { deepSubscribe } from "../subscribe";
import { ReactiveDep } from "../types";
import { EffectSubscriber } from "../types";
import { publishTrackable, Trackable } from "../signal";

export type RefSubscriber<T = any> = EffectSubscriber<T>;

export type RawRef<T = any> = {
  value: T;
  _ref: "ref";
  _state: LProxy<RefState<T>>;
  _deps: ReactiveDep[];
  subscribe: (subscriber: RefSubscriber<T>) => () => void;
  trigger: (key: string) => void;
};
export type Ref<T = any> = LProxy<RawRef<T>>;
export type MaybeRef<T = any> = Ref<T> | T;

export type RefOptions = {
  deep?: boolean;
}

export const ref = <T = any>(initial: T, options: RefOptions = {}): Ref<T> => {
  const state = proxy<RefState<T>>({
    subscribers: [],
  });
  const obj: RawRef<T> = {
    value: initial,
    _ref: "ref" as "ref",
    _state: state,
    _deps: [],
    subscribe: (sub) => {
      if (!state.subscribers.includes(sub)) {
        state.subscribers.push(sub);
      }

      return () => {
        state.subscribers = state.subscribers.filter((it) => it !== sub);
      };
    },
    trigger: (key: string) => {
      const onGetters = state.subscribers
        .map((it) => it.onGet)
        .filter(notNullish);
      onGetters.forEach((sub) => sub(obj, key as any, {}));
    },
  };

  let tracked: Trackable | null = null;

  return proxy<RawRef<T>>(obj, [
    {
      get: (target, key, receiver) => {

        if (options.deep !== false) {
          // integration with signals
          tracked = publishTrackable({
            trigger: () => {},
            onDispose: () => {},
            dispose: () => {},
            dependants: [],
            tracked: [],
            watchers: [],
            lastGet: -1,
            lastSet: -1,
          });
        }

        const next = target[key];
        state.subscribers.forEach((sub) => {
          const last = sub.lastValue;
          if (last !== next && sub.onGet) {
            sub.onGet(target, key, receiver);
            sub.lastValue = last;
          }
        });
      },
      set: (target, key, next, receiver) => {
        state.subscribers.forEach((sub) => {
          if (sub.onSet) {
            sub.onSet(target, key, next, receiver);
          }
        });

        // integration with signals
        if (options.deep !== false && tracked) {
          tracked.dependants.forEach((it) => it.trigger());
          tracked.isTrash = true;
        }
      },
    },
  ]);
};

export const isRef = <T = any>(x: any): x is Ref<T> =>
  x !== null && !!x && typeof x === "object" && x._ref === "ref";

export const unref = <T = any>(x: T | Ref<T>): T => {
  if (isRef<T>(x)) return x.value;
  return x;
};

type RefState<T = any> = {
  subscribers: RefSubscriber<T>[];
};

type EffectFun<T = any> = () => T;

export const watchRef = <T = any>(
  fun: EffectFun<T>,
  deps: ReactiveDep[] = [],
) => {
  deps.forEach((dep) => {
    deepSubscribe(dep, {
      onSet: () => {
        fun();
      },
    });
  });
};
