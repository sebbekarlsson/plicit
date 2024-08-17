import { isLNode, LNode, LNodeAttributes } from "./lnode";
import { isRef, isSignal, MaybeRef, MaybeSignal, Signal } from "./reactivity";
import { Dict } from "./types";

export type Component<T extends Dict = Dict> = (
  props?: T & LNodeAttributes,
) => MaybeRef<LNode> | Component | Signal<LNode> | MaybeSignal<LNode>;

export const isComponent = (x: any): x is Component =>
  !!x && typeof x === "function";

export const unwrapComponentTree = (
  component: Component | MaybeRef<LNode> | Signal<LNode> | MaybeSignal<LNode>,
  propagatedAttribs: LNodeAttributes = {},
): MaybeRef<LNode> | MaybeSignal<LNode> => {

  const unwrap = (component: Component | MaybeRef<LNode> | Signal<LNode> | MaybeSignal<LNode>,  attribs: LNodeAttributes = {}) => {
    if (isSignal(component)) return component;
    if (isRef(component)) return component; //unwrapComponentTree(component.value);
    if (isComponent(component)) {
      const next = component(attribs);
      if (isLNode(next)) {
        next.component.value = component;
      }
      return unwrap(next, attribs);
    }
    return component;
  }

  return unwrap(component, propagatedAttribs)
};
