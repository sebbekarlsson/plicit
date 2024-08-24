import { EventSubscriber } from "../../event";
import { VNodeNativeElement } from "../dom/types";
import { EVNodeEvent, VNodeEvent, VNodeEventEmitter, VNodeEventMap } from "./event";
import { VNodeProps } from "./props";
import { EVNodeType } from "./types";
export declare class VNode {
    sym: 'VNode';
    type: EVNodeType;
    name: string;
    children: VNode[];
    props: VNodeProps;
    emitter: VNodeEventEmitter;
    el?: VNodeNativeElement;
    constructor(name: string, props: VNodeProps);
    updateRef(el: VNodeNativeElement): void;
    create(): void;
    emit(event: Omit<VNodeEvent, 'target'>): void;
    addEventListener<K extends EVNodeEvent>(evtype: K, fun: EventSubscriber<VNodeEventMap[K]['payload'], K, VNode>): () => void;
    appendChild(child: VNode): void;
    setAttribute(key: string, value: any): void;
    hasChild(child: VNode): boolean;
    getChildIndex(child: VNode): number;
    removeChild(child: VNode): void;
}
export declare const vnode: (name: string, props: VNodeProps) => VNode;
export declare const isVNode: (x: any) => x is VNode;
