export type Dict<T = any> = {[key: string]: T};

export type Indexable<T = any> = Dict<T> | Array<T>;

export type NativeElement = Element | HTMLElement | SVGElement;
export type WebElement = NativeElement | Text;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;

export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null

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
