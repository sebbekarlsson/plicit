import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component, isComponent, unwrapComponentTree } from "./component";
import { CSSProperties, cssPropsToString } from "./css";
import { patchElements } from "./element";
import { isRef, LProxy, MaybeRef, proxy, ref, Ref, unref } from "./proxy";
import {
  isHTMLElement,
  isSVGElement,
  isSVGPathElement,
  isText,
  NativeElement,
  NativeElementListeners,
  ReactiveDep,
  unwrapReactiveDep,
} from "./types";
import { stringGenerator } from "./utils";
import { ENodeEvent } from "./nodeEvents";
import { deepSubscribe } from "./subscribe";
import { isSignal, type Signal } from "./signal";
import { ESignalEvent } from "./signal/event";

export type LNodeChild = MaybeRef<LNode> | Component | Signal<any>;

export type LNodeRef = Ref<LNode | undefined>;

export enum ELNodeType {
  ELEMENT = "ELEMENT",
  TEXT_ELEMENT = "TEXT_ELEMENT",
  FRAGMENT = "FRAGMENT",
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

const stringGen = stringGenerator();

export class LNode {
  _lnode: "lnode" = "lnode" as "lnode";
  key: string = "";
  el?: HTMLElement | Text | SVGSVGElement | SVGPathElement;
  parent: Ref<LNode | undefined>;
  attributes: LProxy<LNodeAttributes>;
  name: string;
  children: LNodeChild[] = [];
  mappedChildren: Record<string, LNodeChild> = {};
  component: Ref<Component | undefined>;
  signal: Signal<LNode> | undefined;
  type: ELNodeType = ELNodeType.ELEMENT;
  uid: string = stringGen.next(16);
  events: EventEmitter<NodeEventPayload, ENodeEvent, LNode> = new EventEmitter<
    NodeEventPayload,
    ENodeEvent,
    LNode
  >();

  didMount: boolean = false;
  unsubs: Array<() => void> = [];
  
  constructor(name: string, attributes?: LNodeAttributes) {
    this.name = attributes.tag || name;
    this.attributes = proxy<LNodeAttributes>(attributes || {});
    this.parent = ref<LNode | undefined>(undefined);
    this.component = ref<Component | undefined>(undefined);
    this.key = this.attributes.key || "";
    this.type = this.attributes.nodeType || this.type;

    const deps = this.attributes.deps || [];
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      const nextUnsubs = deepSubscribe(
        dep,
        {
          onSet: () => {
            queueMicrotask(() => {
              this.invalidate();
            });
          },
        },
        1,
      );

      this.unsubs = [...this.unsubs, ...nextUnsubs];
    }
  }

  patchWith(other: LNodeChild) {
    const old = this.el;
    if (!old) return;

    const next = unwrapComponentTree(other);
    let unreffed = unref(next);

    if (isSignal(unreffed)) {
      unreffed = unreffed.get();
    }

    const nextEl = unreffed.getElement();

    if (isLNode(next)) {
      next.unsubs.forEach((unsub) => unsub());
      next.unsubs = [];
    }

    if (isHTMLElement(old) && isHTMLElement(nextEl)) {
      if (isLNode(next)) {
        if (
          old.innerHTML === nextEl.innerHTML &&
          JSON.stringify(Array.from(old.attributes).map((it) => it.value)) ===
            JSON.stringify(Array.from(nextEl.attributes).map((it) => it.value))
        ) {
          return;
        }
      }

      this.el = patchElements(old, nextEl, ([key, value]) => {
        this.attributes[key] = value;
      });
    }
  }

  invalidate() {
    if (!this.parent.value) return;
    const old = this.el;

    if (this.el && old) {
      const component = this.component.value;
      if (component) {
        this.patchWith(component);
        return;
      }

      this.el = undefined;
      const next = this.render();
      this.el.replaceWith(next);
      this.setElement(next);
    }
  }

  emit(event: Omit<NodeEvent<any>, "target">) {
    queueMicrotask(() => {
      this.events.emit({ ...event, target: this });

      switch (event.type) {
        case ENodeEvent.MOUNTED:
          {
            if (this.attributes.onMounted) {
              this.attributes.onMounted(this);
            }
            if (this.attributes.ref) {
              this.attributes.ref.value = this;
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
    const el = this.getElement();

    if (this.attributes.nodeType === ELNodeType.FRAGMENT) {
      target.append(...Array.from(el.childNodes));
    } else {
      target.appendChild(el);
    }
    this.emit({ type: ENodeEvent.MOUNTED, payload: {} });
  }

  createElement() {
    if (this.name === "svg") {
      return document.createElementNS("http://www.w3.org/2000/svg", "svg");
    } else if (this.name === "path") {
      return document.createElementNS("http://www.w3.org/2000/svg", "path");
    }
    if (this.type === ELNodeType.TEXT_ELEMENT)
      return document.createTextNode(this.attributes.text || "");
    return document.createElement(this.name);
  }

  //private _listenForMutation() {
  //  const el = this.el;
  //  if (!el) return;
  //  if (!isHTMLElement(el)) return;

  //  const observer = new MutationObserver(function (mutations) {
  //    if (document.contains(el)) {
  //      observer.disconnect();
  //    }
  //  });
  //  observer.observe(el, {
  //    childList: true,
  //    attributes: true,
  //  });
  //}

  setElement(el: HTMLElement | Text | SVGSVGElement | SVGPathElement) {
    this.el = el;
  }

  ensureElement() {
    if (this.el) return this.el;
    const el = this.createElement();
    this.setElement(el);
    return el;
  }

  getElement() {
    if (this.el) return this.el;
    return this.render();
  }

  private onReceiveChild(child: LNodeChild) {
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
                this.appendChild(child);
              }
            },
          });
        }
      });
    }
  }

  appendChild(child: LNodeChild) {

    const patchChild = () => {
      if (isSignal(child)) {
        child.emitter.addEventListener(ESignalEvent.AFTER_UPDATE, (event) => {
          const sig = event.target;
          const lnode = sig.node._value;
          const thisEl = this.el;
          if (isLNode(lnode)) {
            if (thisEl && isHTMLElement(thisEl)) {
              const index = this.children.indexOf(child);
              if (index >= 0) {
                const myChild = Array.from(thisEl.children)[index];

                const nextEl = lnode.render();
                if (myChild) {
                  if (isHTMLElement(myChild) && isHTMLElement(nextEl)) {
                    patchElements(myChild, nextEl);
                  } else {
                    myChild.replaceWith(nextEl);
                  }
                }
              }
            }
          }
        });
      }
    }
    
    if (isSignal(child)) {
      patchChild();
      child = child.get();
    }
    const unwrapped = unwrapComponentTree(child);

    let unreffed = unref(unwrapped);

    let signalKey: string | undefined = undefined;

    if (isSignal<LNode>(unreffed)) {
      unreffed = unreffed.get();
      signalKey = unreffed.uid;
    }

    if (isLNode(child)) {
      child.parent.value = this;
    }

    const key = signalKey || unreffed.key;

    const el = this.ensureElement();
    if (!this.children.includes(child)) {
      this.children.push(child);
      this.onReceiveChild(child);
    }

    this.mappedChildren[key] = child;
    

    if (isLNode(unreffed)) {
      unreffed.parent.value = this;

      if (!isText(el)) {
        unreffed.mountTo(el);
      }

      if (isComponent(child)) {
        unreffed.component.value = child;
      }

      if (isSignal(unwrapped)) {
        unreffed.signal = unwrapped;
      } else if (isSignal(child)) {
        unreffed.signal = child;
      }
    }
  }

  setAttribute(key: string, value: string) {
    if (!this.el) return;
    if (isText(this.el)) return;

    if (!["innerHTML"].includes(key)) {
      this.el.setAttribute(key, value);
    }

    if (key === "value") {
      (this.el as HTMLInputElement).value = value;
    } else if (key === "innerHTML") {
      (this.el as HTMLElement).innerHTML = value;
    }
  }

  

  render() {
    const _this = this;
    queueMicrotask(() => {
      this.emit({ type: ENodeEvent.MOUNTED, payload: {} });
      this.emit({ type: ENodeEvent.LOADED, payload: {} });
      if (this.attributes.ref) {
        this.attributes.ref.value = _this;
      }
    });

    const el = this.ensureElement();
    if (this.attributes.text) {
      if (isText(el)) {
        el.data = this.attributes.text;
      } else if (!isSVGElement(el) && !isSVGPathElement(el)) {
        el.innerHTML = "";
        el.innerText = unref(this.attributes.text) + "";
      }
    }
    const style = this.attributes.style;
    if (style) {
      if (!isText(el)) {
        this.setAttribute(
          "style",
          typeof style === "string" ? style : cssPropsToString(style),
        );
      }
    }

    queueMicrotask(() => {
      for (const [key, value] of Object.entries(this.attributes.on || {})) {
        el.addEventListener(key, value);
      }
    })
    
    for (const [key, value] of Object.entries(this.attributes)) {
      if (["text", "children", "on", "style", "nodeType"].includes(key))
        continue;
      if (typeof value !== "string") continue;
      if (isText(el)) continue;
      this.setAttribute(key, value);
    }

    const attrChildren = this.attributes.children || [];
    for (let i = 0; i < attrChildren.length; i++) {
      const child = attrChildren[i];
      this.appendChild(child);
    }

    this.emit({ type: ENodeEvent.LOADED, payload: {} });

    return el;
  }
}

export const lnode = (name: string, attributes?: LNodeAttributes) =>
  new LNode(name, attributes);
export const isLNode = (x: any): x is LNode =>
  x !== null && !!x && typeof x === "object" && x._lnode === "lnode";