import { Ref } from "./proxy";

export type Dict<T = any> = {[key: string]: T};

export type Indexable<T = any> = Dict<T> | Array<T>;

export type NativeElement = Element | HTMLElement | SVGElement;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;

export type ReactiveDep = Ref
