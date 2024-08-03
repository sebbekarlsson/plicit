import { isRef, Ref } from "./proxy";

export type Dict<T = any> = {[key: string]: T};

export type Indexable<T = any> = Dict<T> | Array<T>;

export type NativeElement = Element | HTMLElement | SVGElement;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;

export type ReactiveDep<T = any> = Ref<T> | (() => T) | (() => any);

export const unwrapReactiveDep = <T = any>(dep: ReactiveDep<T>): Ref<T> => {
  if (isRef<T>(dep)) return dep;
  if (typeof dep === 'function') {
    return unwrapReactiveDep<T>(dep());
  };
  throw new Error('Not a ref');
}


export const isText = (x: any): x is Text => {
  if (typeof x !== 'object') return false;
  return typeof x.appendChild === 'undefined';// && typeof x.data === 'string';
}

export const isHTMLElement = (x: any): x is HTMLElement => {
  if (typeof x !== 'object') return false;
  if (isText(x)) return false;
  return typeof x.setAttribute === 'function';
}

export const isInputElement = (x: any): x is HTMLInputElement => {
  if (typeof x !== 'object') return false;
  return isHTMLElement(x) && x.tagName === 'INPUT';
}
