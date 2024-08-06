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
  [key: string]: any;
};

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

  constructor(name: string, attributes?: LNodeAttributes) {
    this.name = attributes.tag || name;
    this.attributes = proxy<LNodeAttributes>(attributes || {});
    this.parent = ref<LNode | undefined>(undefined);
    this.component = ref<Component | undefined>(undefined);
    this.key = this.attributes.key || "";
    this.type = this.attributes.nodeType || this.type;

    for (const dep of this.attributes.deps || []) {
      const d = unwrapReactiveDep(dep);
      d.subscribe({
        get: () => {},
        set: () => {
          this.invalidate();
        },
      });
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
            this.el = nextEl;
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
        this.el = nextEl;
        return;
      }
      const next = this.render(true);
      this.el.replaceWith(next);
      this.el = next;
    }
  }

  mountTo(target: NativeElement | null | undefined) {
    if (!target) return;
    const el = this.getElement();
    target.appendChild(el);
  }

  createElement() {
    if (this.name === 'svg') {
      return document.createElementNS("http://www.w3.org/2000/svg", "svg");
    } else if (this.name === 'path') {
      return document.createElementNS("http://www.w3.org/2000/svg", 'path');
    }
    if (this.type === ELNodeType.TEXT_ELEMENT)
      return document.createTextNode(this.attributes.text || "");
    return document.createElement(this.name);
  }

  ensureElement(forceNew: boolean = false) {
    if (forceNew) return this.createElement();
    if (this.el) return this.el;
    const el = this.createElement();
    this.el = el;
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
      });
    }
  }

  appendChild(child: LNodeChild) {
    const unwrapped = unwrapComponentTree(child);
    const unreffed = unref(unwrapped);
    if (isComponent(child)) {
      unreffed.component.value = child;
    }
    const key = unreffed.key;
    const el = this.ensureElement();
    if (isText(el)) return;
    if (!this.children.includes(child)) {
      this.children.push(child);
      this.onReceiveChild(child);
    }

    this.mappedChildren[key] = child;
    unreffed.parent.value = this;
    unreffed.mountTo(el);
  }

  setAttribute(key: string, value: string) {
    if (!this.el) return;
    if (isText(this.el)) return;
    this.el.setAttribute(key, value);
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
      if (key === "value") {
        (el as HTMLInputElement).value = value;
      }
    }
    for (const child of this.attributes.children || []) {
      this.appendChild(child);
    }
    return el;
  }
}

export const lnode = (name: string, attributes?: LNodeAttributes) =>
  new LNode(name, attributes);
export const isLNode = (x: any): x is LNode =>
  typeof x === "object" && x._lnode === "lnode";
