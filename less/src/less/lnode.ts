import { EventEmitter, EventSubscriber, LessEvent } from './event';
import { Component, isComponent, unwrapComponentTree } from "./component";
import { CSSProperties, cssPropsToString } from "./css";
import { getElementsAttributesDiff } from "./element";
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

type LNodeChild = MaybeRef<LNode> | Component;

export enum ELNodeType {
  ELEMENT = "ELEMENT",
  TEXT_ELEMENT = "TEXT_ELEMENT",
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
  [key: string]: any;
};


export type NodeEventPayload = {
}

export type NodeEvent<Payload> = LessEvent<Payload, ENodeEvent, LNode>;

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
  type: ELNodeType = ELNodeType.ELEMENT;
  uid: string = stringGen.next(16);
  events: EventEmitter<NodeEventPayload, ENodeEvent, LNode> = new EventEmitter<NodeEventPayload, ENodeEvent, LNode>();

  didMount: boolean = false;

  constructor(name: string, attributes?: LNodeAttributes) {
    this.name = attributes.tag || name;
    this.attributes = proxy<LNodeAttributes>(attributes || {});
    this.parent = ref<LNode | undefined>(undefined);
    this.component = ref<Component | undefined>(undefined);
    this.key = this.attributes.key || "";
    this.type = this.attributes.nodeType || this.type;

    for (const dep of this.attributes.deps || []) {
      const d = unwrapReactiveDep(dep);

      if (isRef(d)) {
        d.subscribe({
          get: () => {},
          set: () => {
            this.invalidate();
          },
        });
      }
    }
  }

  invalidate() {
    if (!this.parent.value) return;
    const old = this.el;
    if (this.el && old) {
      const component = this.component.value;
      if (component) {
        const next = unwrapComponentTree(component);
        const nextEl = unref(next).getElement();

        if (isHTMLElement(old) && isHTMLElement(nextEl)) {
          if (old.innerHTML !== nextEl.innerHTML) {
            this.el.replaceWith(nextEl);
            this.setElement(nextEl);
          } else {
            const diff = getElementsAttributesDiff(old, nextEl);
            diff.forEach(([key, value]) => {
              this.attributes[key] = value;
              old.setAttribute(key, value);
              (old as any)[key] = value;
            });
          }
          return;
        }

        this.el.replaceWith(nextEl);
        this.setElement(nextEl);
        return;
      }
      const next = this.render(true);
      this.el.replaceWith(next);
      this.setElement(next);
    }
  }

  emit(event: Omit<NodeEvent<any>, 'target'>) {
    this.events.emit({...event, target: this});

    switch (event.type) {
      case ENodeEvent.MOUNTED: {
        if (this.attributes.onMounted) {
          this.attributes.onMounted(this);
        }
      }; break;
      case ENodeEvent.LOADED: {
        if (this.attributes.onLoaded) {
          this.attributes.onLoaded(this);
        }
      }; break;
    }
  }

  addEventListener(evtype: ENodeEvent, sub: EventSubscriber<NodeEventPayload, ENodeEvent, LNode>) {
    return this.events.addEventListener(evtype, sub);
  }

  mountTo(target: NativeElement | null | undefined) {
    if (!target) return;
    const el = this.getElement();
    target.appendChild(el);
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

  setElement(el: HTMLElement | Text | SVGSVGElement | SVGPathElement) {
    this.el = el;
  }

  ensureElement(forceNew: boolean = false) {
    if (forceNew) return this.createElement();
    if (this.el) return this.el;
    const el = this.createElement();
    this.setElement(el);
    return el;
  }

  getElement(forceNew: boolean = false) {
    if (this.el && !forceNew) return this.el;
    return this.render(forceNew);
  }

  private onReceiveChild(child: LNodeChild) {
    if (isRef(child)) {
      child._deps.forEach((d) => {
        const un = unwrapReactiveDep(d);
        if (isRef(un)) {
          un.subscribe({
            get: (_target, key) => {
              if (key === "value") {
                unref(child).invalidate();
              }
            },
            set: (_target, key) => {
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
    const unwrapped = unwrapComponentTree(child);
    const unreffed = unref(unwrapped);
    
    if (isLNode(child)) {
      child.parent.value = this;
    }
    
    const key = unreffed.key;
    const el = this.ensureElement();
    if (isText(el)) return;
    if (!this.children.includes(child)) {
      this.children.push(child);
      this.onReceiveChild(child);
    }

    this.mappedChildren[key] = child;

    if (isLNode(unreffed)) {
      unreffed.parent.value = this;
      unreffed.mountTo(el);

      if (isComponent(child)) {
        unreffed.component.value = child;
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

  render(forceNew: boolean = false) {
    const el = this.ensureElement(forceNew);
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
    for (const [key, value] of Object.entries(this.attributes.on || {})) {
      el.addEventListener(key, value);
    }
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

    this.emit({ type: ENodeEvent.LOADED, payload: {} })

    return el;
  }
}

export const lnode = (name: string, attributes?: LNodeAttributes) =>
  new LNode(name, attributes);
export const isLNode = (x: any): x is LNode =>
  x !== null && !!x && typeof x === "object" && x._lnode === "lnode";
