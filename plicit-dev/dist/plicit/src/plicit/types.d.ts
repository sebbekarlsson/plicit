export type Dict<T = any> = {
    [key: string]: T;
};
export type Indexable<T = any> = Dict<T> | Array<T>;
export type NativeElement = Element | HTMLElement | SVGElement | Comment;
export type WebElement = NativeElement | Text;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;
export declare const notNullish: <T = any>(val?: T | null | undefined) => val is T;
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
export declare const isElementWithChildren: (x: any) => x is ElementWithChildren;
export declare const isElementWithAttributes: (x: any) => x is ElementWithAttributes;
export declare const isReplaceableElement: (x: any) => x is ReplaceableElement;
export declare const isText: (x: any) => x is Text;
export declare const isHTMLElement: (x: any) => x is HTMLElement;
export declare const isInputElement: (x: any) => x is HTMLInputElement;
export declare const isSVGElement: (x: any) => x is SVGSVGElement;
export declare const isSVGPathElement: (x: any) => x is SVGPathElement;
export declare const isComment: (x: any) => x is Comment;
