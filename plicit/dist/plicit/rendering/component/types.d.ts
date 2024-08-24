import { Dict } from "../../types";
import { VNode } from "../vnode";
import { VNodeProps } from "../vnode/props";
export type VComponent<T extends Dict = Dict> = (props: (T & VNodeProps)) => VNode;
export declare const isVComponent: (x: any) => x is VComponent;
