import { Indexable } from "../types";

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
      try {
        subscribers.forEach((sub) => sub.get(target, key, _receiver));
      } catch (e) {
        console.error(e);
      }
      return target[key];
    },
    set: (target, p, next, receiver) => {
      const key = p as keyof T;
      const prev = Reflect.get(target, key, receiver);
      if (prev === next) return true;
      target[p] = next;
      //const result = Reflect.set(target,p, next, receiver);

      try {
        subscribers.forEach((sub) => sub.set(target, key, next, receiver));
      } catch (e) {
        console.error(e);
      }
      return true;
    },
  });
};
