import { Component, isComponent, unwrapComponentTree } from "./component";
import { ELNodeType, isLNode, lnode, LNodeAttributes, LNode } from "./lnode";
import { isSignal, MaybeSignal } from "./reactivity";

const remapChild = (child: any) => {
  if (typeof child === "string" || typeof child === "number")
    return lnode("span", {
      text: child + "",
      nodeType: ELNodeType.TEXT_ELEMENT,
    });
  //if (child === null) return lnode('span', { nodeType: ELNodeType.COMMENT });
  return child;
};

export function ljsx(
  tag: string | Component,
  attribs_: LNodeAttributes,
  ...childs: any[]
) {
  const attribs = attribs_ || {};
  const depth = typeof attribs.__depth === "number" ? attribs.__depth : 0;
  let children = childs
    .map((child) => remapChild(child))
    .flat()
    .filter((it) => isLNode(it) || isComponent(it) || isSignal(it));


  if (typeof tag === "string") {
    return lnode(tag, { ...attribs, __depth: depth + 1, children: children });
  }

  const next = unwrapComponentTree(tag, {
    ...attribs,
    __depth: depth + 1,
    children: children,
  });

  return next;
}

declare global {
  export function ljsx(
    tag: string | Component,
    attribs_: LNodeAttributes,
    ...childs: any[]
  ): MaybeSignal<LNode>;


  // Just to get rid of some typescript warnings
  export function React(
    tag: string | Component,
    attribs_: LNodeAttributes,
    ...childs: any[]
  ): MaybeSignal<LNode>
}

globalThis.React = ljsx;
globalThis.ljsx = ljsx;
