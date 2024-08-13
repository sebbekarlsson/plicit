import { LNode, LNodeAttributes } from "./lnode";
import { isRef, MaybeRef } from "./proxy";
import { isSignal, MaybeSignal, Signal } from "./signal";
import { Dict } from "./types";

export type Component<T extends Dict = Dict> = (props?: (T & LNodeAttributes)) => (MaybeRef<LNode> | Component | Signal<LNode> | MaybeSignal<LNode>);

export const isComponent = (x: any): x is Component => !!x && typeof x === 'function';

export const unwrapComponentTree = (component: Component | MaybeRef<LNode> | Signal<LNode> | MaybeSignal<LNode>, attribs?: LNodeAttributes): MaybeRef<LNode> | MaybeSignal<LNode> => {
  if (isSignal(component)) return component;
  if (isRef(component)) return unwrapComponentTree(component.value);
  if (!isComponent(component)) return component;
  const next = component(attribs);
  if (isComponent(next)) return unwrapComponentTree(next, attribs);
  if (isSignal(next)) {
    return next;
  };
  return next;
}
