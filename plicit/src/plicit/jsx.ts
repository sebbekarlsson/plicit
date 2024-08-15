import { Component, isComponent } from "./component";
import { ELNodeType, isLNode, lnode, LNodeAttributes } from "./lnode";
import { isRef, isSignal } from "./reactivity";

let implicit_key: number = 0;

const nextKey = () => {
  const k = implicit_key;
  implicit_key = (implicit_key + 1) % Number.MAX_SAFE_INTEGER;
  return k;
}

export function ljsx(
  tag: string | Component,
  attribs_: LNodeAttributes,
  ...childs: any[]
) {
  const attribs = attribs_ || {};
  const children = childs
    .map((child) =>
      (typeof child === "string" || typeof child === 'number')
        ? lnode("span", { text: child + '', nodeType: ELNodeType.TEXT_ELEMENT })
        : child,
    )
    .flat()
    .filter((it) => isLNode(it) || isComponent(it) || isRef(it) || isSignal(it));

  if (isComponent(tag)) {
    return tag({ ...attribs, children: children });
  }

  return lnode(tag, { ...attribs, children: children }, nextKey());
}
