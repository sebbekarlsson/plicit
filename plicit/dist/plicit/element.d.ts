export declare const getElementAttributes: (a: HTMLElement) => Attr[];
type KeyPair = [string, string];
export declare const getElementsAttributesDiff: (a: HTMLElement, b: HTMLElement) => Array<KeyPair>;
export declare const getElementsDiff: (a: HTMLElement, b: HTMLElement) => KeyPair[];
export declare const patchElements: (old: HTMLElement, nextEl: HTMLElement, attributeCallback?: (pair: KeyPair) => void) => HTMLElement;
export {};
