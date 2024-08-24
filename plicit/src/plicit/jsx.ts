import { isPrimitive } from "./is";
import { AsyncSignal, isAsyncSignal, isSignal, MaybeSignal, Signal } from "./reactivity";
import { EVNodeType, isVNode, vnode, VNode, VNodeProps } from "./rendering";
import { isVComponent, VComponent } from "./rendering/component/types";

const remapChild = (child: any) => {
  if (typeof child === "string" || typeof child === "number")
    return vnode("span", {
      text: child + "",
      _type: EVNodeType.TEXT
    });
  //if (child === null) return lnode('span', { nodeType: ELNodeType.COMMENT });
  return child;
};


const remapItem = (node: VNode | Signal | AsyncSignal | VComponent) => {
  if (isVComponent(node)) {
    return vnode('div', { _component: node, _type: EVNodeType.FUNCTION })
  }
  
  if (isVNode(node)) return node;

  if (isSignal(node) || isAsyncSignal(node)) {

    if (isSignal(node)) {
      const v = node.peek();
      if (isPrimitive(v)) {
        return vnode('div', { text: node, _type: EVNodeType.TEXT });
      }
    }

    return vnode('div', { _signal: node});
  }

  if (isSignal(node) || isAsyncSignal(node)) {
    return vnode('div', { _signal: node });
  }

  if (typeof node === 'string') {
    return vnode(node, {});
  }
  
  return vnode('div', { text: 'INVALID' });
}

export function ljsx(
  tag: string | VNode | VComponent,
  attribs_: VNodeProps,
  ...childs: any[]
): MaybeSignal<VNode> {
  const attribs = attribs_ || {};
  let children = childs
    .map((child) => remapChild(child))
    .flat()
    .filter((it) => isVNode(it) || isSignal(it) || isAsyncSignal(it)).map((it => remapItem(it)));

//  if (typeof tag === "string") {
//    return lnode(tag, { ...attribs, __depth: depth + 1, children: children });
//  }
//
//  const next = unwrapComponentTree(tag, {
//    ...attribs,
//    __depth: depth + 1,
//    children: children,
//  });


  if (isVNode(tag)) return tag;

  if (isSignal(tag) || isAsyncSignal(tag)) {

    if (isSignal(tag)) {
      const v = tag.peek();
      if (isPrimitive(v)) {
        return vnode('div', { ...attribs, text: tag, _type: EVNodeType.TEXT, children });
      }
    }
    
    return vnode('div', { ...attribs, _signal: tag, children });
  }

  if (typeof tag === 'string') {
    return vnode(tag, {...attribs, children});
  }

  if (isVComponent(tag)) {
    return vnode('div', { _component: () => tag({...attribs, children}), _type: EVNodeType.FUNCTION })
  }
  
  return vnode('div', { text: 'INVALID' });
}

declare global {
  export function ljsx(
    tag: string | VNode | VComponent,
    attribs_: VNodeProps,
    ...childs: any[]
  ): MaybeSignal<VNode>;

  // Just to get rid of some typescript warnings
  export function React(
    tag: string | VNode | VComponent,
    attribs_: VNodeProps,
    ...childs: any[]
  ): MaybeSignal<VNode>;
}

globalThis.React = ljsx;
globalThis.ljsx = ljsx;
