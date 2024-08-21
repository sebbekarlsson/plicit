import { PendingSignal } from "./components/pending-signal";
import { isAsyncFunction } from "./is";
import { ELNodeType, isLNode, lnode, LNode, LNodeAttributes, lnodeX } from "./lnode";
import { ENodeEvent } from "./nodeEvents";
import {
  isSignal,
  MaybeAsyncSignal,
  MaybeSignal,
  pget,
  Signal,
} from "./reactivity";
import { asyncSignal, isAsyncSignal } from "./reactivity/signal/asyncSignal";
import { popScope, pushScope, withCurrentScope } from "./scope";
import { Dict } from "./types";

export type UnwrappableComponent =
  | Component
  | AsyncComponent
  | Signal<LNode>
  | MaybeSignal<LNode>
  | MaybeAsyncSignal<LNode>
  | string;

export type Component<T extends Dict = Dict> = (
  props?: T & LNodeAttributes,
) =>  Component | Signal<LNode> | MaybeSignal<LNode> | MaybeAsyncSignal<LNode> | string;

export type AsyncComponent<T extends Dict = Dict> = (
  props?: T & LNodeAttributes,
) =>  Promise<Component | Signal<LNode> | MaybeSignal<LNode> | MaybeAsyncSignal<LNode> | string>;

export const isAsyncComponent = (x: any): x is AsyncComponent => !!x && isAsyncFunction(x); 

export const isComponent = (x: any): x is Component =>
  !!x && typeof x === "function" && !isAsyncComponent(x);


export const unwrapComponentTree = (
  component: UnwrappableComponent,
  propagatedAttribs: LNodeAttributes = {},
): MaybeSignal<LNode> => {
  
  const unwrap = (
    component: UnwrappableComponent,
    attribs: LNodeAttributes = {},
    depth: number = 0,
  ) => {

    if (isAsyncComponent(component)) {
      return unwrap(asyncSignal<any>(async () => await component(attribs), { isComputed: true, fallback: unwrap(pget(attribs.asyncFallback || PendingSignal)) }), attribs, 0);
    }
    
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
          ret.component = component;
        }
      })
      popScope();
      return ret;
    }
    if (isLNode(component)) {
      return component;
    }
    if (isSignal(component)) return lnodeX(ELNodeType.SIGNAL, { ...attribs, signal: component });
    if (isAsyncSignal(component)) return lnodeX(ELNodeType.ASYNC_SIGNAL, { ...attribs, asyncSignal: component });
    if (typeof component === 'string' || typeof component === 'number') {
      return lnode('span', { text: component + '', nodeType: ELNodeType.TEXT_ELEMENT });
    }
    return component;
  };

  return unwrap(component, propagatedAttribs);
};
