import { LNode, LNodeAttributes } from "./lnode";
import { MaybeRef } from "./proxy";
import { MaybeSignal, Signal } from "./signal";
import { Dict } from "./types";
export type Component<T extends Dict = Dict> = (props?: (T & LNodeAttributes)) => (MaybeRef<LNode> | Component | Signal<LNode> | MaybeSignal<LNode>);
export declare const isComponent: (x: any) => x is Component;
export declare const unwrapComponentTree: (component: Component | MaybeRef<LNode> | Signal<LNode> | MaybeSignal<LNode>, attribs?: LNodeAttributes) => MaybeRef<LNode> | MaybeSignal<LNode>;
