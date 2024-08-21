import { MaybeSignal, Signal } from "./reactivity";

export type Dict<T = any> = { [key: string]: T };

export type Indexable<T = any> = Dict<T> | Array<T>;

export type NativeElement = Element | HTMLElement | SVGElement | Comment;
export type WebElement = NativeElement | Text;
export type NativeListener<K extends keyof HTMLElementEventMap> = (
  this: HTMLButtonElement,
  ev: HTMLElementEventMap[K],
) => any;
export type UnknownNativeListener = (
  this: HTMLButtonElement,
  ev: HTMLElementEventMap[keyof HTMLElementEventMap],
) => any;
export type NativeElementListeners = Record<
  keyof HTMLElementEventMap,
  UnknownNativeListener
>;

export const notNullish = <T = any>(val?: T | null | undefined): val is T =>
  val != null;

export type ReplaceableElement = {
  replaceWith: (...nodes: (Node | string)[]) => void;
};

export type ElementWithAttributes = {
  setAttribute: (qualifiedName: string, value: string) => void;
  attributes: NamedNodeMap;
  getAttribute: (qualifiedName: string) => string | null;
};

export type ElementWithChildren = {
  children: HTMLCollection;
};

export const isElementWithChildren = (x: any): x is ElementWithChildren => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return typeof x.children === "object";
};

export const isElementWithAttributes = (x: any): x is ElementWithAttributes => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return (
    typeof x.setAttribute === "function" &&
    typeof x.attributes === "object" &&
    typeof x.getAttribute === "function"
  );
};

export const isReplaceableElement = (x: any): x is ReplaceableElement => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return typeof x.replaceWith === "function";
};

export const isText = (x: any): x is Text => {
  if (typeof x !== "object") return false;
  return typeof x.appendChild === "undefined"; // && typeof x.data === 'string';
};

export const isHTMLElement = (x: any): x is HTMLElement => {
  if (typeof x !== "object") return false;
  if (isText(x)) return false;
  return typeof x.setAttribute === "function";
};

export const isInputElement = (x: any): x is HTMLInputElement => {
  if (typeof x !== "object") return false;
  return isHTMLElement(x) && (x.tagName || "").toLowerCase() === "input";
};

export const SVG_NAMES = [
  "svg",
  "path",
  "polyline",
  "circle",
  "line",
  "g",
  "rect",
  "text",
  "defs",
  "linearGradient",
  "stop",
  "mask",
  "symbol",
  "use",
];
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export const isSVGSVGElement = (x: any): x is SVGSVGElement => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return isHTMLElement(x) && (x.tagName || "").toLowerCase() === "svg";
};

export const isSVGElement = (x: any): x is SVGElement => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return isHTMLElement(x) && (x.tagName || "").toLowerCase() === "svg";
};

export const isSVGPathElement = (x: any): x is SVGPathElement => {
  if (typeof x !== "object") return false;
  return isHTMLElement(x) && (x.tagName || "").toLowerCase() === "path";
};

export const isSVGPolylineElement = (x: any): x is SVGPolylineElement => {
  if (typeof x !== "object") return false;
  return isHTMLElement(x) && (x.tagName || "").toLowerCase() === "polyline";
};

export const isAnySVGElement = (x: any): boolean => {
  if (typeof x !== "object") return false;
  return (
    isHTMLElement(x) && SVG_NAMES.map(it => it.toLowerCase()).includes((x.tagName || "").toLowerCase())
  );
};

export const isComment = (x: any): x is Comment => {
  if (!x) return false;
  if (typeof x !== "object") return false;
  return typeof x.appendData === "function";
};


export type ElementClass = string | string[] | Array<string | Signal<string>>;
