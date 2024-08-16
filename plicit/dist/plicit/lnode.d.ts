import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component } from "./component";
import { CSSProperties } from "./css";
import { NativeElement, NativeElementListeners } from "./types";
import { ENodeEvent } from "./nodeEvents";
import { MaybeRef, Ref, Signal } from "./reactivity";
import { ReactiveDep, LProxy } from "./reactivity";
export type LNodeChild = MaybeRef<LNode> | Component | Signal<LNode>;
export type LNodeRef = Ref<LNode | undefined>;
export declare enum ELNodeType {
    ELEMENT = "ELEMENT",
    TEXT_ELEMENT = "TEXT_ELEMENT",
    FRAGMENT = "FRAGMENT",
    EMPTY = "EMPTY",
    COMMENT = "COMMENT"
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
    ref?: LNodeRef;
    class?: string;
    [key: string]: any;
};
export type LNodeAttributes = WithSignals<LNodeAttributesBase>;
export type NodeEventPayload = {};
export type NodeEvent<Payload> = PlicitEvent<Payload, ENodeEvent, LNode>;
export declare class LNode {
    _lnode: "lnode";
    depth: number;
    implicitKey: number;
    isTrash: boolean;
    key: string;
    el?: HTMLElement | Text | SVGSVGElement | SVGPathElement | Comment;
    elRef: LNodeRef;
    parent: Signal<LNode | undefined>;
    attributes: LProxy<LNodeAttributes>;
    name: string;
    children: LNodeChild[];
    mappedChildren: Record<string, LNodeChild>;
    component: Ref<Component | undefined>;
    signal: Signal<LNode> | undefined;
    type: ELNodeType;
    uid: string;
    events: EventEmitter<NodeEventPayload, ENodeEvent, LNode>;
    didMount: boolean;
    unsubs: Array<() => void>;
    constructor(name: string, attributes?: LNodeAttributes, implicitKey?: number, depth?: number);
    destroy(): void;
    toObject(): any;
    patchWith(other: LNodeChild): void;
    invalidate(): void;
    updateRef(): void;
    emit(event: Omit<NodeEvent<any>, "target">): void;
    addEventListener(evtype: ENodeEvent, sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>): () => void;
    mountTo(target: NativeElement | null | undefined): void;
    createElement(): HTMLElement | SVGSVGElement | SVGPathElement | Comment;
    listenForMutation(callback: (disconnect: () => void) => void): void;
    setElement(el: HTMLElement | Text | SVGSVGElement | SVGPathElement | Comment): void;
    ensureElement(): HTMLElement | SVGSVGElement | SVGPathElement | Comment;
    getElement(): HTMLElement | SVGSVGElement | SVGPathElement | Comment;
    private onReceiveChild;
    patchChildWithNode(index: number, newNode: LNode): void;
    patchChildFromSignal(child: LNodeChild, sig: Signal<LNode>, _childIndex: number): void;
    appendChild(child: LNodeChild, childIndex: number): void;
    setAttribute(key: string, value: string): void;
    render(): HTMLElement | SVGSVGElement | SVGPathElement | Comment;
}
export declare const lnode: (name: string, attributes?: LNodeAttributes, implicitKey?: number, depth?: number) => LNode;
export declare const none: () => LNode;
export declare const isLNode: (x: any) => x is LNode;
export {};
