import { LNode, LNodeAttributes } from "./lnode";
import { MaybeRef, MaybeSignal, Signal } from "./reactivity";
import { Dict } from "./types";
export type UnwrappableComponent = Component | MaybeRef<LNode> | Signal<LNode> | MaybeSignal<LNode>;
export type UnwrappedComponent = MaybeRef<LNode> | MaybeSignal<LNode>;
export type Component<T extends Dict = Dict> = (props?: T & LNodeAttributes) => MaybeRef<LNode> | Component | Signal<LNode> | MaybeSignal<LNode>;
export declare const isComponent: (x: any) => x is Component;
export declare const unwrapComponentTree: (component: UnwrappableComponent, propagatedAttribs?: LNodeAttributes) => MaybeRef<LNode> | MaybeSignal<LNode>;
