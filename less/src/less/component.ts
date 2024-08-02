import { LNode, LNodeAttributes } from "./lnode";
import { Dict } from "./types";

export type Component<T extends Dict = Dict> = (props?: (T & LNodeAttributes)) => (LNode | Component);

export const isComponent = (x: any): x is Component => !!x && typeof x === 'function';

export const unwrapComponentTree = (component: Component | LNode, attribs?: LNodeAttributes): LNode => {
  if (!isComponent(component)) return component;
  const next = component(attribs);
  if (isComponent(next)) return unwrapComponentTree(next, attribs);
  return next;
}
