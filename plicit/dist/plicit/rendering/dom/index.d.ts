import { MaybeSignal } from "../../reactivity";
import { VNode } from "../vnode";
export declare const renderVNode: (node: MaybeSignal<VNode>) => HTMLElement | Text;
export declare const mountVNode: (node: VNode, target: Element) => void;
