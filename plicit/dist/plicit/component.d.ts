import { LNode, LNodeAttributes } from "./lnode";
import { MaybeSignal, Signal } from "./reactivity";
import { Dict } from "./types";
export type UnwrappableComponent = Component | Signal<LNode> | MaybeSignal<LNode> | string;
export type UnwrappedComponent = MaybeSignal<LNode>;
export type Component<T extends Dict = Dict> = (props?: T & LNodeAttributes) => Component | Signal<LNode> | MaybeSignal<LNode> | string;
export declare const isComponent: (x: any) => x is Component;
export declare const unwrapComponentTree: (component: UnwrappableComponent, propagatedAttribs?: LNodeAttributes) => MaybeSignal<LNode>;
export declare const unwrapChild: (child: UnwrappableComponent) => LNode;
