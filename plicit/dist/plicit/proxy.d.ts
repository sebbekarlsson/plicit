import { Indexable } from "./types";
export type LProxy<T extends Indexable> = T;
type ProxySubscriber<T extends Indexable> = {
    get: (target: T, key: keyof T, receiver: any) => any;
    set: (target: T, key: keyof T, next: T[keyof T], receiver: any) => any;
};
export declare const proxy: <T extends Indexable>(initial: T, subscribers?: ProxySubscriber<T>[]) => LProxy<T>;
export {};
