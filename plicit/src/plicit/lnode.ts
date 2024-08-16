import { EventEmitter, EventSubscriber, PlicitEvent } from "./event";
import { Component, isComponent, unwrapComponentTree } from "./component";
import { CSSProperties, cssPropsToString } from "./css";
import { patchElements } from "./element";
import {
  isHTMLElement,
  isSVGElement,
  isSVGPathElement,
  isText,
  NativeElement,
  NativeElementListeners,
  WebElement,
} from "./types";
import { stringGenerator } from "./utils";
import { ENodeEvent } from "./nodeEvents";
import {
  isRef,
  isSignal,
  MaybeRef,
  pget,
  ref,
  Ref,
  signal,
  Signal,
  unref,
  watchSignal,
} from "./reactivity";
import {
  ESignalEvent,
  ReactiveDep,
  unwrapReactiveDep,
  deepSubscribe,
  LProxy,
  proxy,
} from "./reactivity";

export type LNodeChild = MaybeRef<LNode> | Component | Signal<LNode>;

export type LNodeRef = Ref<LNode | undefined>;

export enum ELNodeType {
  ELEMENT = "ELEMENT",
  TEXT_ELEMENT = "TEXT_ELEMENT",
  FRAGMENT = "FRAGMENT",
}

type WithSignals<T> = {
  [Prop in keyof T]: T[Prop] extends (Ref | Signal | ((...args: any[]) => void)) ? T[Prop] : (T[Prop] | Signal<T[Prop]>);
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

const stringGen = stringGenerator();
export class LNode {
  _lnode: "lnode" = "lnode" as "lnode";
  depth: number = -1;
  implicitKey: number = -1;
  isTrash: boolean = false;
  key: string = "";
  el?: HTMLElement | Text | SVGSVGElement | SVGPathElement;
  elRef: LNodeRef;
  parent: Signal<LNode | undefined>;
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

  constructor(name: string, attributes?: LNodeAttributes, implicitKey: number = -1, depth: number = -1) {
    this.name = pget(attributes.tag || name);
    this.attributes = proxy<LNodeAttributes>(attributes || {});
    this.parent = signal<LNode | undefined>(undefined);
    this.component = ref<Component | undefined>(undefined);
    this.key = pget(this.attributes.key || "");
    this.type = pget(this.attributes.nodeType || this.type);
    this.depth = depth;
    this.implicitKey = implicitKey;
    this.elRef = ref(undefined);

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

      this.unsubs = [...this.unsubs, ...nextUnsubs];
    }
  }

  destroy() {
    this.unsubs.forEach((unsub) => unsub());
    this.unsubs = [];
    if (this.parent) {
      this.parent.dispose();
    }
    if (this.signal) {
      this.signal.dispose()
    }
    this.isTrash = true;

    const attribs = Object.values(this.attributes);

    for (const attrib of attribs) {
      if (isSignal(attrib)) {
        attrib.dispose();
      }
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
      if (next.parent) {
        next.parent.dispose();
      }
      if (next.signal) {
        next.signal.dispose();
      }
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

      this.setElement(patchElements(old, nextEl, ([key, value]) => {
        this.attributes[key] = value;
      }));
    }
  }

  invalidate() {
    if (!this.parent.get()) return;
    const old = this.el;
    if (!old) return;

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

  updateRef() {
    if (this.attributes.ref) {
      this.attributes.ref.value = this;
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

  listenForMutation(callback: (disconnect: () => void) => void) {
    const el = this.el;
    if (!el) return;
    if (!isHTMLElement(el)) return;

    const observer = new MutationObserver((_mutations) => {
      if (document.contains(el)) {
        callback(() => observer.disconnect());
      }
    });
    observer.observe(el, {
      childList: true,
      attributes: true,
    });
  }

  setElement(el: HTMLElement | Text | SVGSVGElement | SVGPathElement) {
    this.el = el;
    this.updateRef();
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
    if (!thisEl || !isHTMLElement(thisEl)) return;

    const myChild = Array.from(thisEl.children)[index];
    const nextEl = newNode.render();
    if (myChild) {
      if (isHTMLElement(myChild) && isHTMLElement(nextEl)) {
        const patchedEl = patchElements(myChild, nextEl);
        if (patchedEl !== myChild) {
          myChild.replaceWith(patchedEl);
        }
      } else {
        myChild.replaceWith(nextEl);
      }
    }
  }

  patchChildFromSignal(child: LNodeChild, sig: Signal<LNode>) {
    const lnode = unwrapComponentTree(sig.node._value);
    if (isLNode(lnode)) {
      const index = this.children.indexOf(child);
      if (index >= 0) {
        this.patchChildWithNode(index, lnode);
      }
    }
  }

  appendChild(child: LNodeChild, childIndex: number) {
    if (isSignal(child)) {
      const sig = child;
      child.emitter.addEventListener(ESignalEvent.AFTER_UPDATE, (event) => {
        this.patchChildFromSignal(child, event.target);
      });
      child = child.get();
      if (isLNode(child)) {
        child.signal = sig;
      }
    }
    const unwrapped = unwrapComponentTree(child);

    let unreffed = pget(unwrapped);

    let signalKey: string | undefined = undefined;

    if (isSignal<LNode>(unreffed)) {
      unreffed = unreffed.get();
      signalKey = unreffed.uid;
    }

    if (isLNode(child)) {
      child.parent.set(this);
      child.depth = this.depth + 1;
    }
    if (isLNode(unreffed)) {
      unreffed.depth = this.depth + 1;
    }


    if (isLNode(unwrapped)) {
      unwrapped.depth = this.depth + 1;
    }

    const key = signalKey || unreffed.key;

    const el = this.ensureElement();
    if (!this.children.includes(child)) {
      this.children.push(child);
      this.onReceiveChild(child, childIndex);
    }

    this.mappedChildren[key] = child;

    if (isLNode(unreffed)) {
      unreffed.parent.set(this);

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
    const el = this.ensureElement();

    queueMicrotask(() => {
      this.emit({ type: ENodeEvent.MOUNTED, payload: {} });
      this.emit({ type: ENodeEvent.LOADED, payload: {} });
    });
    
    if (this.attributes.text) {
      if (isText(el)) {
        el.data = this.attributes.text;
      } else if (!isSVGElement(el) && !isSVGPathElement(el)) {
        el.innerHTML = "";
        el.innerText = unref(this.attributes.text) + "";
      }
    }

    
    const style = this.attributes.style;
    if (style && !isText(el)) {
      if (isSignal(style)) {
        this.unsubs.push(watchSignal(style, () => {
          const styleValue = pget(style);
          this.setAttribute(
            "style",
            typeof styleValue === "string" ? styleValue : cssPropsToString(styleValue),
          );
        }, { immediate: true }));
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
        this.unsubs.push(watchSignal(clazz, () => {
          const classValue = pget(clazz);
          this.setAttribute("class", classValue);
        }, { immediate: true }));
      } else {
        this.setAttribute("class", clazz);
      }
    }

    for (const [key, value] of Object.entries(this.attributes.on || {})) {
      el.addEventListener(key, value);
    }

    for (const [key, value] of Object.entries(this.attributes)) {
      if (["text", "children", "on", "style", "nodeType", "class"].includes(key))
        continue;
      if (typeof value !== "string") continue;
      if (isText(el)) continue;
      this.setAttribute(key, value);
    }

    const attrChildren = pget(this.attributes.children || []);
    for (let i = 0; i < attrChildren.length; i++) {
      const child = attrChildren[i];
      this.appendChild(child, i);
    }

    this.emit({ type: ENodeEvent.LOADED, payload: {} });

    return el;
  }
}

export const lnode = (name: string, attributes?: LNodeAttributes, implicitKey: number = -1, depth: number = -1) =>
  new LNode(name, attributes, implicitKey, depth);
export const isLNode = (x: any): x is LNode =>
  x !== null && !!x && typeof x === "object" && x._lnode === "lnode";
