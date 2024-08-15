import { Component } from "./component";
type GlobalSetupState = {
    setup?: () => void;
};
export declare const GSetupState: GlobalSetupState;
export declare const setup: (component: Component, el: HTMLElement | Element) => void;
export {};
