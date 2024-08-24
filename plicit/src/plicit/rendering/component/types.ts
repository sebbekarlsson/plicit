import { isAsyncFunction } from "../../is";
import { Dict } from "../../types";
import { VNode } from "../vnode";
import { VNodeProps } from "../vnode/props";

export type VComponent<T extends Dict = Dict> = (props: (T & VNodeProps)) => VNode;

export const isVComponent = (x: any): x is VComponent => {
  if (x === null || typeof x === 'undefined') return false;
  return typeof x === 'function' && !isAsyncFunction(x);
}
