import { Indexable, notNullish, ReactiveDep } from "./types";

export type LProxy<T extends Indexable> = T;

type ProxySubscriber<T extends Indexable> = {
  get: (target: T, key: keyof T, receiver: any) => any;
  set: (target: T, key: keyof T, next: T[keyof T], receiver: any) => any;
};

export const proxy = <T extends Indexable>(
  initial: T,
  subscribers: ProxySubscriber<T>[] = [],
): LProxy<T> => {
  return new Proxy<T>(initial, {
    get: (target, p, _receiver) => {
      const key = p as keyof T;
      subscribers.forEach((sub) => sub.get(target, key, _receiver));
      return target[key];
    },
    set: (target, p, next, receiver) => {
      const key = p as keyof T;
      const prev = Reflect.get(target, key, receiver);
      if (prev === next) return true;
      const result = Reflect.set(target,p, next, receiver);
      subscribers.forEach((sub) => sub.set(target, key, next, receiver));
      return result;
    },
  });
};

type RefState<T = any> = {
  subscribers: RefSubscriber<T>[];
};



export type EffectSubscriber<T = any> = {
  onGet?: (target: RawRef<T>, key: keyof RawRef<T>, receiver: any) => any;
  onSet?: (
    target: RawRef<T>,
    key: keyof RawRef<T>,
    next: RawRef<T>[keyof RawRef<T>],
    receiver: any,
  ) => any;
  lastValue?: any;
};

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

export const ref = <T = any>(initial: T): Ref<T> => {
  const state = proxy<RefState<T>>({
    subscribers: [],
  });
  const obj: RawRef<T> = {
    value: initial,
    _ref: "ref" as "ref",
    _state: state,
    _deps: [],
    subscribe: (sub) => {
      state.subscribers.push(sub);

      return () => {
        state.subscribers = state.subscribers.filter((it) => it !== sub);
      };
    },
    trigger: (key: string) => {
      const onGetters = state.subscribers.map(it => it.onGet).filter(notNullish);
      onGetters.forEach((sub) => sub(obj, key as any, {}));
    }
  };
  return proxy<RawRef<T>>(obj, [
    {
      get: (target, key, receiver) => {
        const next = target[key];
        state.subscribers.forEach((sub) => {
          const last = sub.lastValue;
          if (last !== next && sub.onGet) {
            sub.onGet(target, key, receiver)
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
