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
    FRAGMENT = "FRAGMENT"
}
export type LNodeAttributes = {
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
    [key: string]: any;
};
export type NodeEventPayload = {};
export type NodeEvent<Payload> = PlicitEvent<Payload, ENodeEvent, LNode>;
export declare class LNode {
    _lnode: "lnode";
    key: string;
    el?: HTMLElement | Text | SVGSVGElement | SVGPathElement;
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
    constructor(name: string, attributes?: LNodeAttributes);
    patchWith(other: LNodeChild): void;
    invalidate(): void;
    emit(event: Omit<NodeEvent<any>, "target">): void;
    addEventListener(evtype: ENodeEvent, sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>): () => void;
    mountTo(target: NativeElement | null | undefined): void;
    createElement(): HTMLElement | Text | SVGSVGElement | SVGPathElement;
    setElement(el: HTMLElement | Text | SVGSVGElement | SVGPathElement): void;
    ensureElement(): HTMLElement | Text | SVGSVGElement | SVGPathElement;
    getElement(): HTMLElement | Text | SVGSVGElement | SVGPathElement;
    private onReceiveChild;
    patchChildWithNode(index: number, newNode: LNode): void;
    patchChildFromSignal(child: LNodeChild, sig: Signal<LNode>): void;
    appendChild(child: LNodeChild): void;
    setAttribute(key: string, value: string): void;
    render(): HTMLElement | Text | SVGSVGElement | SVGPathElement;
}
export declare const lnode: (name: string, attributes?: LNodeAttributes) => LNode;
export declare const isLNode: (x: any) => x is LNode;
