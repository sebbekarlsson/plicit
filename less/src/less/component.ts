import { LNode, LNodeAttributes } from "./lnode";
import { isRef, MaybeRef, unref } from "./proxy";
import { Dict } from "./types";

export type Component<T extends Dict = Dict> = (props?: (T & LNodeAttributes)) => (MaybeRef<LNode> | Component);

export const isComponent = (x: any): x is Component => !!x && typeof x === 'function';

export const unwrapComponentTree = (component: Component | MaybeRef<LNode>, attribs?: LNodeAttributes): MaybeRef<LNode> => {
  if (isRef(component)) return unwrapComponentTree(component.value);
  if (!isComponent(component)) return component;
  const next = component(attribs);
  if (isComponent(next)) return unwrapComponentTree(next, attribs);
  return next;
}
