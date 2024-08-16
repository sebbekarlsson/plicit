export type Dict<T = any> = {
    [key: string]: T;
};
export type Indexable<T = any> = Dict<T> | Array<T>;
export type NativeElement = Element | HTMLElement | SVGElement;
export type WebElement = NativeElement | Text;
export type NativeListener<K extends keyof HTMLElementEventMap> = (this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any;
export type UnknownNativeListener = (this: HTMLButtonElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
export type NativeElementListeners = Record<keyof HTMLElementEventMap, UnknownNativeListener>;
export declare const notNullish: <T = any>(val?: T | null | undefined) => val is T;
export declare const isText: (x: any) => x is Text;
export declare const isHTMLElement: (x: any) => x is HTMLElement;
export declare const isInputElement: (x: any) => x is HTMLInputElement;
export declare const isSVGElement: (x: any) => x is SVGSVGElement;
export declare const isSVGPathElement: (x: any) => x is SVGPathElement;
