import { Component } from "./component";
import { LNode } from "./lnode";
type GlobalSetupState = {
    setup?: () => void;
    root?: LNode;
};
export declare const GSetupState: GlobalSetupState;
export declare const setup: (component: Component, el: HTMLElement | Element) => void;
export {};
