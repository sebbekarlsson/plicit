import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component } from "./component";
import { CSSProperties } from "./css";
import { NativeElement, NativeElementListeners } from "./types";
import { ENodeEvent } from "./nodeEvents";
import { MaybeRef, Ref, Signal } from "./reactivity";
import { ReactiveDep } from "./reactivity";
export type LNodeChild = MaybeRef<LNode> | Component | Signal<LNode>;
export type LNodeRef = Ref<LNode | undefined>;
export declare enum ELNodeType {
    ELEMENT = "ELEMENT",
    TEXT_ELEMENT = "TEXT_ELEMENT",
    FRAGMENT = "FRAGMENT",
    EMPTY = "EMPTY",
    COMMENT = "COMMENT",
    SLOT = "SLOT"
}
type WithSignals<T> = {
    [Prop in keyof T]: T[Prop] extends Ref | Signal | ((...args: any[]) => void) ? T[Prop] : T[Prop] | Signal<T[Prop]>;
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
    isRoot?: boolean;
    ref?: LNodeRef;
    class?: string;
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
export type NodeEventBeforeRender = PlicitEvent<{}, ENodeEvent.BEFORE_RENDER, LNode>;
export type NodeEventCleanup = PlicitEvent<{}, ENodeEvent.CLEANUP, LNode>;
export type NodeEventReceiveParent = PlicitEvent<NodeEventReceiveParentPayload, ENodeEvent.RECEIVE_PARENT, LNode>;
export type NodeEvent = NodeEventBeforeReplace | NodeEventAfterReplace | NodeEventReplaced | NodeEventUpdated | NodeEventLoaded | NodeEventUnMounted | NodeEventMounted | NodeEventCleanup | NodeEventBeforeRender | NodeEventReceiveParent;
export type LNodeNativeElement = HTMLElement | Text | SVGSVGElement | SVGPathElement | Comment | SVGElement | Element;
export declare class LNode {
    _lnode: "lnode";
    _id: number;
    _idCounter: number;
    isRoot: boolean;
    isTrash: boolean;
    key: string;
    el?: LNodeNativeElement;
    parent: Signal<LNode | undefined>;
    attributes: LNodeAttributes;
    name: string;
    children: LNodeChild[];
    component: Ref<Component | undefined>;
    childComponents: Component[];
    signal: Signal<LNode> | undefined;
    type: ELNodeType;
    slots: Record<string, LNodeRef>;
    events: EventEmitter<NodeEventPayload, ENodeEvent, LNode>;
    unsubs: Array<() => void>;
    constructor(name: string, attributes?: LNodeAttributes);
    emitCleanup(): void;
    cleanup(): void;
    destroy(): void;
    toObject(): any;
    setId(id: number): void;
    patchWith(other: LNodeChild): void;
    invalidate(): void;
    updateRef(): void;
    emit(event: NodeEvent): void;
    addEventListener(evtype: ENodeEvent, sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>): () => void;
    mountTo(target: NativeElement | null | undefined): void;
    createElement(): HTMLElement | SVGElement | Comment;
    listenForMutation(callback: (disconnect: () => void) => void): void;
    setElement(el: LNodeNativeElement): void;
    ensureElement(): LNodeNativeElement;
    getElement(): LNodeNativeElement;
    getSlot(name: string): LNodeRef;
    setSlot(name: string, node: LNode): void;
    private onReceiveChild;
    patchChildWithNode(index: number, newNode: LNode): void;
    patchChildFromSignal(child: LNodeChild, sig: Signal<LNode>, _childIndex: number): void;
    appendChild(child: LNodeChild, childIndex: number): void;
    setAttribute(key: string, value: string): void;
    render(): LNodeNativeElement;
}
export declare const lnode: (name: string, attributes?: LNodeAttributes) => LNode;
export declare const none: () => LNode;
export declare const isLNode: (x: any) => x is LNode;
export {};
