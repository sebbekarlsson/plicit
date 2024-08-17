import { ElementWithAttributes } from "./types";
export declare const setElementAttribute: (el: ElementWithAttributes, key: string, value: any) => void;
export declare const getElementAttributes: (a: ElementWithAttributes) => Attr[];
type KeyPair = [string, string];
export declare const getElementsAttributesDiff: (a: ElementWithAttributes, b: ElementWithAttributes) => Array<KeyPair>;
export declare const getElementsDiff: (a: ElementWithAttributes, b: ElementWithAttributes) => KeyPair[];
type PatchElementsOptions = {
    attributeCallback?: (pair: KeyPair) => void;
    onBeforeReplace?: (old: HTMLElement, next: HTMLElement) => void;
    onAfterReplace?: (old: HTMLElement, next: HTMLElement) => void;
};
export declare const patchElements: (old: HTMLElement, nextEl: HTMLElement, options?: PatchElementsOptions) => HTMLElement;
export {};
