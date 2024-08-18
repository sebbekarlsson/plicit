import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component, isComponent, unwrapComponentTree } from "./component";
import { CSSProperties, cssPropsToString } from "./css";
import { patchElements } from "./element";
import {
  isComment,
  isElementWithChildren,
  isHTMLElement,
  isReplaceableElement,
  isSVGElement,
  isSVGPathElement,
  isSVGSVGElement,
  isText,
  NativeElement,
  NativeElementListeners,
  SVG_NAMES,
} from "./types";
import { ENodeEvent } from "./nodeEvents";
import {
  isRef,
  isSignal,
  MaybeRef,
  pget,
  Ref,
  signal,
  Signal,
  unref,
  watchSignal,
} from "./reactivity";
import { ReactiveDep, unwrapReactiveDep, deepSubscribe } from "./reactivity";
import { withCurrentScope } from "./scope";
import { unique } from "./utils";

export type LNodeChild = MaybeRef<LNode> | Component | Signal<LNode>;

export type LNodeRef = Ref<LNode | undefined>;

export enum ELNodeType {
  ELEMENT = "ELEMENT",
  TEXT_ELEMENT = "TEXT_ELEMENT",
  FRAGMENT = "FRAGMENT",
  EMPTY = "EMPTY",
  COMMENT = "COMMENT",
  SLOT = "SLOT",
  COMPONENT = "COMPONENT",
  SIGNAL = "COMPONENT",
  REF = "REF",
}

type WithSignals<T> = {
  [Prop in keyof T]: T[Prop] extends Ref | Signal | ((...args: any[]) => void)
    ? T[Prop]
    : T[Prop] | Signal<T[Prop]>;
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

export type NodeEventBeforeReplace = PlicitEvent<
  {},
  ENodeEvent.BEFORE_REPLACE,
  LNode
>;
export type NodeEventAfterReplace = PlicitEvent<
  {},
  ENodeEvent.AFTER_REPLACE,
  LNode
>;
export type NodeEventReplaced = PlicitEvent<{}, ENodeEvent.REPLACED, LNode>;
export type NodeEventUpdated = PlicitEvent<{}, ENodeEvent.UPDATED, LNode>;
export type NodeEventLoaded = PlicitEvent<{}, ENodeEvent.LOADED, LNode>;
export type NodeEventUnMounted = PlicitEvent<{}, ENodeEvent.UNMOUNTED, LNode>;
export type NodeEventMounted = PlicitEvent<{}, ENodeEvent.MOUNTED, LNode>;
export type NodeEventBeforeUnMount = PlicitEvent<
  {},
  ENodeEvent.BEFORE_UNMOUNT,
  LNode
>;
export type NodeEventBeforeRender = PlicitEvent<
  {},
  ENodeEvent.BEFORE_RENDER,
  LNode
>;
export type NodeEventCleanup = PlicitEvent<{}, ENodeEvent.CLEANUP, LNode>;
export type NodeEventReceiveParent = PlicitEvent<
  NodeEventReceiveParentPayload,
  ENodeEvent.RECEIVE_PARENT,
  LNode
>;

export type NodeEvent =
  | NodeEventBeforeReplace
  | NodeEventAfterReplace
  | NodeEventReplaced
  | NodeEventUpdated
  | NodeEventLoaded
  | NodeEventUnMounted
  | NodeEventMounted
  | NodeEventCleanup
  | NodeEventBeforeRender
  | NodeEventBeforeUnMount
  | NodeEventReceiveParent;

export type LNodeNativeElement =
  | HTMLElement
  | Text
  | SVGSVGElement
  | SVGPathElement
  | Comment
  | SVGElement
  | Element;

export class LNode {
  _lnode: "lnode" = "lnode" as "lnode";
  isRoot: boolean = false;
  isTrash: boolean = false;
  key: string = "";
  el?: LNodeNativeElement;
  parent: Signal<LNode | undefined>;
  attributes: LNodeAttributes;
  name: string;
  children: LNodeChild[] = [];
  childNodes: LNode[] = [];
  component: Component | undefined = undefined;
  type: ELNodeType = ELNodeType.ELEMENT;
  resizeObserver: ResizeObserver | null = null;
  events: EventEmitter<NodeEventPayload, ENodeEvent, LNode> = new EventEmitter<
    NodeEventPayload,
    ENodeEvent,
    LNode
  >();
  unsubs: Array<() => void> = [];

  constructor(name: string, attributes?: LNodeAttributes) {
    this.name = pget(attributes.tag || name);
    this.attributes = attributes || {};
    this.parent = signal<LNode | undefined>(undefined);
    this.key = pget(this.attributes.key || "");
    this.type = pget(this.attributes.nodeType || this.type);
    this.isRoot = pget(this.attributes.isRoot) || false;

    const deps = pget(this.attributes.deps || []);
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      const nextUnsubs = deepSubscribe(
        dep,
        {
          onSet: () => {
            this.invalidate();
          },
          onTrigger: () => {
            this.invalidate();
          },
        },
        -1,
      );
      nextUnsubs.forEach((unsub) => this.addGC(unsub));
    }
  }

  addGC(unsub: () => void) {
    if (this.unsubs.includes(unsub)) return;
    this.unsubs.push(unsub);
  }

  addChildNode(node: LNode) {
    if (this.childNodes.includes(node)) return;
    this.childNodes.push(node);
  }

  emitBeforeUnmount() {
    this.emit({ type: ENodeEvent.BEFORE_UNMOUNT, payload: {} });
    this.getChildNodes().forEach((it) => it.emitBeforeUnmount());
  }

  emitUnmounted() {
    this.emit({ type: ENodeEvent.UNMOUNTED, payload: {} });
    this.getChildNodes().forEach((it) => it.emitUnmounted());
  }

  emitCleanup() {
    this.emit({ type: ENodeEvent.CLEANUP, payload: {} });
  }

  cleanup() {
    this.emitCleanup();
    this.unsubs.forEach((unsub) => unsub());
    this.unsubs = [];
  }

  destroy() {
    this.cleanup();
    this.events.clear();
  }

  getChildCount() {
    const attr = (pget(this.attributes.children) || []);
    const childNodes = this.getChildNodes();
    return Math.max(attr.length, childNodes.length);
  }

  getChildNodes() {
    return this.childNodes;
    //const other = (pget(this.attributes.children) || [])
    //  .map((it) => pget(unwrapComponentTree(it)))
    //  .filter((it) => isLNode(it));
    //return unique([
    //  ...this.childNodes,
    //  ...this.children.map((it) => pget(unwrapComponentTree(it))),
    //  ...other,
    //]);
  }

  toObject() {
    return {
      name: this.name,
      el: this.el,
      type: this.type,
      children: pget(this.attributes.children || []).map((child) => {
        const unwrapped = unwrapComponentTree(child);
        const unreffed = pget(unwrapped);
        if (isLNode(unreffed)) return unreffed.toObject();
        return unreffed;
      }),
    };
  }

  patchWith(other: LNodeChild) {
    const old = this.el;
    if (!old) throw new Error(`Expected an existing element.`);

    const next = unwrapComponentTree(other);
    let unreffed = unref(next);

    if (isSignal(unreffed)) {
      unreffed = unreffed.get();
    }

    const nextEl = unreffed.getElementOrRender();

    if (isLNode(next)) {
      next.cleanup();
    }

    if (isHTMLElement(old) && isHTMLElement(nextEl)) {
      this.setElement(
        patchElements(old, nextEl, {
          attributeCallback: ([key, value]) => {
            this.attributes[key] = value;
          },
          onBeforeReplace: (_old, _next) => {
            this.emit({ type: ENodeEvent.BEFORE_REPLACE, payload: {} });
          },
          onAfterReplace: (_old, _next) => {
            this.emit({ type: ENodeEvent.AFTER_REPLACE, payload: {} });
          },
        }),
      );
    }
  }

  invalidate() {
    const component = this.attributes._component || this.component;
    if (component && this.el) {
      this.patchWith(component);
      return;
    }

    this.emit({ type: ENodeEvent.BEFORE_REPLACE, payload: {} });
    this.el = undefined;
    const next = this.render();
    if (next !== this.el) {
      console.log("muck");
      this.el.replaceWith(next);
    }
    this.setElement(next);
    this.emit({ type: ENodeEvent.AFTER_REPLACE, payload: {} });
  }

  updateRef() {
    if (this.attributes.ref) {
      this.attributes.ref.value = this;
    }
  }

  emit(event: NodeEvent) {
    queueMicrotask(() => {
      this.events.emit({ ...event, target: this });

      switch (event.type) {
        case ENodeEvent.BEFORE_REPLACE:
          {
          }
          break;
        case ENodeEvent.MOUNTED:
          {
            if (this.attributes.onMounted) {
              //this.attributes.onMounted(this);
            }
          }
          break;
        case ENodeEvent.LOADED:
          {
            if (this.attributes.onLoaded) {
              this.attributes.onLoaded(this);
            }
          }
          break;
      }
    });
  }

  addEventListener(
    evtype: ENodeEvent,
    sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>,
  ) {
    return this.events.addEventListener(evtype, sub);
  }

  mountTo(target: NativeElement | null | undefined) {
    if (!target) return;
    const el = this.getElementOrRender();

    if (target.contains(el)) return;

    if (
      this.attributes.nodeType === ELNodeType.FRAGMENT &&
      !isComment(target)
    ) {
      target.append(...Array.from(el.childNodes));
    } else {
      target.appendChild(el);
    }

    if (isHTMLElement(el) && !this.resizeObserver && this.getChildCount() > 0) {
      let didContain: boolean = false;
      const obs = this.resizeObserver = new ResizeObserver(() => {
        if (document.contains(el)) {
          didContain = true;
          this.emit({ type: ENodeEvent.MOUNTED, payload: {} });
        } else if (didContain) {
          obs.disconnect();
          queueMicrotask(() => {
            this.emitBeforeUnmount();
            queueMicrotask(() => {
              this.events.slots[ENodeEvent.BEFORE_UNMOUNT] = [];
              queueMicrotask(() => {
                this.emitUnmounted();
                queueMicrotask(() => {
                  // TODO: figure out where we can call destroy(), we can't do it here,
                  // because some things are breaking.
                  // this.destroy();
                });
              });
            });
          });
        }
      });
      obs.observe(el);
    }
  }

  createElement(): NativeElement {
    const create = () => {
      if (this.type === ELNodeType.SIGNAL) {
        const sig = this.attributes.signal;
        if (isSignal<LNode>(sig)) {
          this.addGC(
            watchSignal(
              sig,
              (next) => {
                if (!this.el) return;
                next.invalidate();
                this.patchWith(next);
                next.cleanup();
              },
              { immediate: true },
            ),
          );
          return sig.get().getElementOrRender();
        }
      }

      if (this.type === ELNodeType.COMMENT) {
        return document.createComment(`comment`);
      }

      if (SVG_NAMES.includes(this.name)) {
        return document.createElementNS(
          `http://www.w3.org/2000/svg`,
          this.name,
        );
      }

      if (this.name === "svg") {
        return document.createElementNS("http://www.w3.org/2000/svg", "svg");
      } else if (this.name === "path") {
        return document.createElementNS("http://www.w3.org/2000/svg", "path");
      }
      if (this.type === ELNodeType.TEXT_ELEMENT)
        return document.createTextNode(this.attributes.text || "");
      return document.createElement(this.name);
    };

    const el = create();

    return el;
  }

  setElement(el: LNodeNativeElement) {
    this.el = el;
    this.updateRef();
    return el;
  }

  getElementOrRender() {
    if (this.el) return this.el;
    return this.render();
  }

  getElementOrThrow() {
    if (this.el) return this.el;
    throw new Error(`Node did not have an element when it was expected.`);
  }

  private onReceiveChild(child: LNodeChild, childIndex: number) {
    if (isRef(child)) {
      child._deps.forEach((d) => {
        const un = unwrapReactiveDep(d);
        if (isRef(un)) {
          un.subscribe({
            onGet: (_target, key) => {
              if (key === "value") {
                unref(child).invalidate();
              }
            },
            onSet: (_target, key) => {
              if (key === "value") {
                this.appendChild(child, childIndex);
              }
            },
            onTrigger: () => {
              this.appendChild(child, childIndex);
            },
          });
        }
      });
    }
  }

  patchChildWithNode(index: number, newNode: LNode) {
    const thisEl = this.el;
    if (!thisEl) return;

    const myChild = isElementWithChildren(thisEl)
      ? Array.from(thisEl.children)[index]
      : null;
    const nextEl = newNode.render();
    const oldNode = this.children[index]
      ? pget(unwrapComponentTree(this.children[index]))
      : null;

    if (myChild) {
      if (isHTMLElement(myChild) && isHTMLElement(nextEl)) {
        patchElements(myChild, nextEl, {
          onBeforeReplace: (_old, _next) => {
            if (oldNode && isLNode(oldNode)) {
              oldNode.emit({ type: ENodeEvent.BEFORE_REPLACE, payload: {} });
            }
          },
          onAfterReplace: (_old, _next) => {
            if (oldNode && isLNode(oldNode)) {
              oldNode.emit({ type: ENodeEvent.AFTER_REPLACE, payload: {} });
            }
          },
        });
      } else {
        if (isReplaceableElement(myChild)) {
          myChild.replaceWith(nextEl);
        }
      }
    } else {
      if (isElementWithChildren(thisEl)) {
        const childs = Array.from(thisEl.children);
        if (childs.length <= 0) {
          thisEl.appendChild(nextEl);
          this.addChildNode(newNode);
        }
      }
    }
  }

  appendChild(child: LNodeChild, childIndex: number) {
    if (isSignal<LNode>(child)) {
      this.addGC(
        watchSignal(child, (next) => {
          this.patchChildWithNode(childIndex, next);
        }),
      );
      child = child.get();
    }

    const unwrapped = unwrapComponentTree(child);
    let unreffed = pget(unwrapped);

    if (isLNode(child)) {
      child.parent.set(this);
      this.emit({ type: ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });
    }

    const el = this.getElementOrThrow();

    if (!this.children.includes(child)) {
      this.children.push(child);
      this.onReceiveChild(child, childIndex);
    }

    if (isLNode(unreffed)) {
      unreffed.parent.set(this);
      this.emit({ type: ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });

      if (!isText(el)) {
        unreffed.mountTo(el);
      }

      if (isComponent(child)) {
        unreffed.component = child;
      }

      this.addChildNode(unreffed);
    }
  }

  setAttribute(key: string, value: string) {
    if (!this.el) return;
    if (isText(this.el) || isComment(this.el)) return;

    if (!["innerHTML", "_value"].includes(key)) {
      this.el.setAttribute(key, value);
    }

    if (key === "value") {
      (this.el as HTMLInputElement).value = value;
    } else if (key === "innerHTML") {
      (this.el as HTMLElement).innerHTML = value;
    }
  }

  render() {
    this.emit({ type: ENodeEvent.BEFORE_RENDER, payload: {} });
    this.childNodes = [];
    const el = this.setElement(this.el || this.createElement());
    if (this.attributes.text) {
      if (isText(el) || isComment(el)) {
        el.data = this.attributes.text;
      } else if (
        !isSVGElement(el) &&
        !isSVGPathElement(el) &&
        !isSVGSVGElement(el)
      ) {
        el.innerHTML = "";
        // @ts-ignore
        el.innerText = unref(this.attributes.text) + "";
      }
    }

    const style = this.attributes.style;
    if (style && !isText(el)) {
      if (isSignal(style)) {
        this.addGC(
          watchSignal(
            style,
            () => {
              const styleValue = pget(style);
              this.setAttribute(
                "style",
                typeof styleValue === "string"
                  ? styleValue
                  : cssPropsToString(styleValue),
              );
            },
            { immediate: true },
          ),
        );
      } else {
        this.setAttribute(
          "style",
          typeof style === "string" ? style : cssPropsToString(style),
        );
      }
    }

    const clazz = this.attributes.class;
    if (clazz && !isText(el)) {
      if (isSignal(clazz)) {
        this.addGC(
          watchSignal(
            clazz,
            () => {
              const classValue = pget(clazz);
              this.setAttribute("class", classValue);
            },
            { immediate: true },
          ),
        );
      } else {
        this.setAttribute("class", clazz);
      }
    }

    for (const [key, value] of Object.entries(this.attributes.on || {})) {
      el.removeEventListener(key, value);
      el.addEventListener(key, value);
    }

    if (!isText(el)) {
      for (const [key, value] of Object.entries(this.attributes)) {
        if (
          [
            "text",
            "children",
            "on",
            "style",
            "nodeType",
            "class",
            "__depth",
          ].includes(key)
        )
          continue;
        if (!(typeof value == "string" || typeof value === "number")) continue;
        this.setAttribute(key, value + "");
      }
    }

    const attrChildren = pget(this.attributes.children || []);
    for (let i = 0; i < attrChildren.length; i++) {
      const child = attrChildren[i];
      this.appendChild(child, i);
    }

    this.emit({ type: ENodeEvent.LOADED, payload: {} });

    withCurrentScope((scope) => {
      console.log({ scope });
    });

    return el;
  }
}

export const lnode = (name: string, attributes?: LNodeAttributes) =>
  new LNode(name, attributes);

export const lnodeX = (
  nodeType: ELNodeType,
  attributes: LNodeAttributes = {},
) => new LNode(nodeType, { ...attributes, nodeType: nodeType });

// TODO: remove this and allow `null` as children to indicate that nothing should render
export const none = () =>
  lnode("span", {
    nodeType: ELNodeType.EMPTY,
    style: {
      display: "none",
      position: "fixed",
      top: "0",
      left: "0",
      opacity: "0%",
      width: "0px",
      height: "0px",
      pointerEvents: "none",
    },
  });
export const isLNode = (x: any): x is LNode =>
  x !== null && !!x && typeof x === "object" && x._lnode === "lnode";
