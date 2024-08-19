import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component } from "./component";
import { CSSProperties } from "./css";
import { NativeElement, NativeElementListeners } from "./types";
import { ENodeEvent } from "./nodeEvents";
import { MaybeSignal, Signal } from "./reactivity";
import { ReactiveDep } from "./reactivity";
export type LNodeChild = Component | MaybeSignal<LNode>;
export type LNodeRef = Signal<LNode | undefined>;
export declare enum ELNodeType {
    ELEMENT = "ELEMENT",
    TEXT_ELEMENT = "TEXT_ELEMENT",
    FRAGMENT = "FRAGMENT",
    EMPTY = "EMPTY",
    COMMENT = "COMMENT",
    SLOT = "SLOT",
    COMPONENT = "COMPONENT",
    SIGNAL = "COMPONENT"
}
type WithSignals<T> = {
    [Prop in keyof T]: T[Prop] extends Signal | ((...args: any[]) => void) ? T[Prop] : T[Prop] | Signal<T[Prop]>;
};
export type LNodeAttributesBase = {
    text?: any;
    children?: LNodeChild[];
    on?: Partial<NativeElementListeners>;
    deps?: ReactiveDep[];
    key?: string;
    style?: CSSProperties | string;
    nodeType?: ELNodeType;
    tag?: string;
    onMounted?: (node: LNode) => any;
    onLoaded?: (node: LNode) => any;
    watch?: string[];
    isRoot?: boolean;
    ref?: Signal<LNode | undefined>;
    class?: string;
    component?: Component;
    _component?: Component;
    signal?: Signal;
    [key: string]: any;
};
export type LNodeAttributes = WithSignals<LNodeAttributesBase>;
export type NodeEventReceiveParentPayload = {
    parent: LNode;
};
export type NodeEventPayload = NodeEventReceiveParentPayload | {};
export type NodeEventBeforeReplace = PlicitEvent<{}, ENodeEvent.BEFORE_REPLACE, LNode>;
export type NodeEventAfterReplace = PlicitEvent<{}, ENodeEvent.AFTER_REPLACE, LNode>;
export type NodeEventReplaced = PlicitEvent<{}, ENodeEvent.REPLACED, LNode>;
export type NodeEventUpdated = PlicitEvent<{}, ENodeEvent.UPDATED, LNode>;
export type NodeEventLoaded = PlicitEvent<{}, ENodeEvent.LOADED, LNode>;
export type NodeEventUnMounted = PlicitEvent<{}, ENodeEvent.UNMOUNTED, LNode>;
export type NodeEventMounted = PlicitEvent<{}, ENodeEvent.MOUNTED, LNode>;
export type NodeEventBeforeUnMount = PlicitEvent<{}, ENodeEvent.BEFORE_UNMOUNT, LNode>;
export type NodeEventBeforeRender = PlicitEvent<{}, ENodeEvent.BEFORE_RENDER, LNode>;
export type NodeEventCleanup = PlicitEvent<{}, ENodeEvent.CLEANUP, LNode>;
export type NodeEventReceiveParent = PlicitEvent<NodeEventReceiveParentPayload, ENodeEvent.RECEIVE_PARENT, LNode>;
export type NodeEvent = NodeEventBeforeReplace | NodeEventAfterReplace | NodeEventReplaced | NodeEventUpdated | NodeEventLoaded | NodeEventUnMounted | NodeEventMounted | NodeEventCleanup | NodeEventBeforeRender | NodeEventBeforeUnMount | NodeEventReceiveParent;
export type LNodeNativeElement = HTMLElement | Text | SVGSVGElement | SVGPathElement | Comment | SVGElement | Element;
export declare class LNode {
    _lnode: "lnode";
    isRoot: boolean;
    isTrash: boolean;
    key: string;
    el?: LNodeNativeElement;
    parent: Signal<LNode | undefined>;
    attributes: LNodeAttributes;
    name: string;
    children: LNodeChild[];
    childNodes: LNode[];
    component: Component | undefined;
    type: ELNodeType;
    resizeObserver: ResizeObserver | null;
    events: EventEmitter<NodeEventPayload, ENodeEvent, LNode>;
    unsubs: Array<() => void>;
    constructor(name: string, attributes?: LNodeAttributes);
    addGC(unsub: () => void): void;
    addChildNode(node: LNode): void;
    emitBeforeUnmount(): void;
    emitUnmounted(): void;
    emitCleanup(): void;
    cleanup(): void;
    destroy(): void;
    getChildCount(): number;
    getChildElementNode(index: number): ChildNode;
    getChildNodes(): LNode[];
    toObject(): any;
    patchWith(other: LNodeChild): void;
    invalidate(): void;
    updateRef(): void;
    emit(event: NodeEvent): void;
    addEventListener(evtype: ENodeEvent, sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>): () => void;
    mountTo(target: NativeElement | null | undefined): void;
    createElement(): NativeElement;
    setElement(el: LNodeNativeElement): LNodeNativeElement;
    getElementOrRender(): LNodeNativeElement;
    getElementOrThrow(): LNodeNativeElement;
    patchChildWithNode(index: number, newNode: LNode): void;
    appendChild(child: LNodeChild, childIndex: number): void;
    setAttribute(key: string, value: string): void;
    render(): LNodeNativeElement;
}
export declare const lnode: (name: string, attributes?: LNodeAttributes) => LNode;
export declare const lnodeX: (nodeType: ELNodeType, attributes?: LNodeAttributes) => LNode;
export declare const none: () => LNode;
export declare const isLNode: (x: any) => x is LNode;
export {};
