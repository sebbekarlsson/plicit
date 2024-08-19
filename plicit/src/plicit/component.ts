import { ELNodeType, isLNode, lnode, LNode, LNodeAttributes, lnodeX } from "./lnode";
import { ENodeEvent } from "./nodeEvents";
import {
  isSignal,
  MaybeSignal,
  Signal,
} from "./reactivity";
import { popScope, pushScope, withCurrentScope } from "./scope";
import { Dict } from "./types";

export type UnwrappableComponent =
  | Component
  | Signal<LNode>
  | MaybeSignal<LNode>
  | string;

export type UnwrappedComponent = MaybeSignal<LNode>;

export type Component<T extends Dict = Dict> = (
  props?: T & LNodeAttributes,
) =>  Component | Signal<LNode> | MaybeSignal<LNode> | string;

export const isComponent = (x: any): x is Component =>
  !!x && typeof x === "function";


export const unwrapComponentTree = (
  component: UnwrappableComponent,
  propagatedAttribs: LNodeAttributes = {},
): MaybeSignal<LNode> => {
  
  const unwrap = (
    component: UnwrappableComponent,
    attribs: LNodeAttributes = {},
    depth: number = 0,
  ) => {
    if (isComponent(component)) {
      pushScope();
      const next = component({...attribs, component});
      
      if (isLNode(next)) {
        next.component = component;
      }
      const ret = unwrap(next, {...attribs, component}, depth + 1);

      withCurrentScope((scope) => {
        if (isLNode(ret)) {
          scope.onMounted.forEach(fun => ret.addEventListener(ENodeEvent.MOUNTED, () => fun(ret)));
          scope.onBeforeUnmount.forEach(fun => ret.addEventListener(ENodeEvent.BEFORE_UNMOUNT, () => fun(ret)));
          scope.onUnmounted.forEach(fun => ret.addEventListener(ENodeEvent.UNMOUNTED, () => fun(ret)));
        }
      })
      popScope();
      return ret;
    }
    if (isLNode(component)) {
      return component;
    }
    if (isSignal(component)) return lnodeX(ELNodeType.SIGNAL, { ...attribs, signal: component }); 
    if (typeof component === 'string' || typeof component === 'number') {
      return lnode('span', { text: component + '', nodeType: ELNodeType.TEXT_ELEMENT });
    }
    return component;
  };

  return unwrap(component, propagatedAttribs);
};

export const unwrapChild = (child: UnwrappableComponent): LNode => { 
  if (isSignal<LNode>(child)) {
    return unwrapChild(child.get());
  }
  if (isComponent(child)) {
    return unwrapChild(child({}));
  }
  if (typeof child === 'string' || typeof child === 'number') {
    return lnode('span', { text: child + '', nodeType: ELNodeType.TEXT_ELEMENT });
  }
  if (isLNode(child)) {
    if (child.attributes.signal) return unwrapChild(child.attributes.signal);
    return child;
  }
  return child;
}
