import { LNode, LNodeAttributes } from "./lnode";
import { MaybeAsyncSignal, MaybeSignal, Signal } from "./reactivity";
import { Dict } from "./types";
export type UnwrappableComponent = Component | AsyncComponent | Signal<LNode> | MaybeSignal<LNode> | MaybeAsyncSignal<LNode> | string;
export type Component<T extends Dict = Dict> = (props?: T & LNodeAttributes) => Component | Signal<LNode> | MaybeSignal<LNode> | MaybeAsyncSignal<LNode> | string;
export type AsyncComponent<T extends Dict = Dict> = (props?: T & LNodeAttributes) => Promise<Component | Signal<LNode> | MaybeSignal<LNode> | MaybeAsyncSignal<LNode> | string>;
export declare const isAsyncComponent: (x: any) => x is AsyncComponent;
export declare const isComponent: (x: any) => x is Component;
export declare const unwrapComponentTree: (component: UnwrappableComponent, propagatedAttribs?: LNodeAttributes) => MaybeSignal<LNode>;
