import { ElementWithAttributes } from "./types";
export declare const setElementAttribute: (el: ElementWithAttributes, key: string, value: any) => void;
export declare const getElementAttributes: (a: ElementWithAttributes) => Attr[];
type KeyPair = [string, string];
export declare const getElementsAttributesDiff: (a: ElementWithAttributes, b: ElementWithAttributes) => Array<KeyPair>;
export declare const getElementsDiff: (a: ElementWithAttributes, b: ElementWithAttributes) => KeyPair[];
export declare const patchElements: (old: HTMLElement, nextEl: HTMLElement, attributeCallback?: (pair: KeyPair) => void) => HTMLElement;
export {};
