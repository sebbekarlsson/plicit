import { isFunction } from "./is";
import { isRef, MaybeRef, Ref } from "./proxy";

export type Dict<T = any> = {[key: string]: T};

export type Indexable<T = any> = Dict<T> | Array<T>;

export type NativeElement = Element | HTMLElement | SVGElement;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;

export type ReactiveDep<T = any> = Ref<T> | MaybeRef<T> | (() => T) | (() => any);
export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null

export const unwrapReactiveDep = <T = any>(dep: ReactiveDep<T>): MaybeRef<T> => {
  if (isRef<T>(dep)) return dep;
  if (isFunction(dep)) {
    return unwrapReactiveDep<T>(dep());
  };
  return dep;
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

export const isSVGElement = (x: any): x is SVGSVGElement => {
  if (!x) return false;
  if (typeof x !== 'object') return false;
  return isHTMLElement(x) && (x.tagName || '').toLowerCase() === 'svg';
}

export const isSVGPathElement = (x: any): x is SVGPathElement => {
  if (typeof x !== 'object') return false;
  return isHTMLElement(x) && (x.tagName || '').toLowerCase() === 'path';
}
