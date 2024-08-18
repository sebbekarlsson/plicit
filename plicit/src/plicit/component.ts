import { isLNode, LNode, LNodeAttributes } from "./lnode";
import {
  isRef,
  isSignal,
  MaybeRef,
  MaybeSignal,
  Signal,
} from "./reactivity";
import { Dict } from "./types";

export type UnwrappableComponent =
  | Component
  | MaybeRef<LNode>
  | Signal<LNode>
  | MaybeSignal<LNode>;

export type UnwrappedComponent = MaybeRef<LNode> | MaybeSignal<LNode>;

export type Component<T extends Dict = Dict> = (
  props?: T & LNodeAttributes,
) => MaybeRef<LNode> | Component | Signal<LNode> | MaybeSignal<LNode>;

export const isComponent = (x: any): x is Component =>
  !!x && typeof x === "function";


export const unwrapComponentTree = (
  component: UnwrappableComponent,
  propagatedAttribs: LNodeAttributes = {},
): MaybeRef<LNode> | MaybeSignal<LNode> => {
  
  const unwrap = (
    component: UnwrappableComponent,
    attribs: LNodeAttributes = {},
    depth: number = 0,
  ) => {
    if (isSignal(component)) {
      return component;
    }
    if (isRef(component)) return component; //unwrapComponentTree(component.value);
    if (isComponent(component)) {
      const next = component(attribs);
      if (isLNode(next)) {
        next.component.value = component;
      }
      return unwrap(next, attribs, depth + 1);
    }
    return component;
  };

  const next = unwrap(component, propagatedAttribs);

  return next;
};
