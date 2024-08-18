import { Component, isComponent } from "./component";
import { ELNodeType, isLNode, lnode, LNodeAttributes } from "./lnode";
import { isRef, isSignal } from "./reactivity";


const remapChild = (child: any) => {
  if (typeof child === "string" || typeof child === 'number')
    return lnode("span", { text: child + '', nodeType: ELNodeType.TEXT_ELEMENT });
  //if (child === null) return lnode('span', { nodeType: ELNodeType.COMMENT });
  return child;
}

export function ljsx(
  tag: string | Component,
  attribs_: LNodeAttributes,
  ...childs: any[]
) {
  const attribs = attribs_ || {};
  const depth = typeof attribs.__depth === 'number' ? attribs.__depth : 0;
  const children = childs
    .map((child) => remapChild(child))
    .flat()
    .filter((it) => isLNode(it) || isComponent(it) || isRef(it) || isSignal(it));

  if (isComponent(tag)) {
    const next = tag({ ...attribs, __depth: depth + 1, children: children });
    return next;
  }

  return lnode(tag, { ...attribs, __depth: depth + 1, children: children });
}
