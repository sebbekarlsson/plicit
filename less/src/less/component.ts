import { LNode } from "./lnode";

export type Component = () => (LNode | Component);

export const isComponent = (x: any): x is Component => !!x && typeof x === 'function';

export const unwrapComponentTree = (component: Component | LNode): LNode => {
  if (!isComponent(component)) return component;
  const next = component();
  if (isComponent(next)) return unwrapComponentTree(next);
  return next;
}
