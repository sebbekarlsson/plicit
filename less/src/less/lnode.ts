import { Component, isComponent, unwrapComponentTree } from "./component";
import { LProxy, proxy, ref, Ref, unref } from "./proxy";
import { NativeElement, NativeElementListeners, ReactiveDep } from "./types";

type LNodeChild = LNode | Component;

export type LNodeAttributes = {
  text?: any;
  children?: LNodeChild[];
  on?: Partial<NativeElementListeners>;
  deps?: ReactiveDep[];
  key?: string;
  [key: string]: any;
}


export class LNode {
  _lnode: 'lnode' = 'lnode' as 'lnode';
  key: string = '';
  el?: HTMLElement;
  parent: Ref<LNode | undefined>;
  attributes: LProxy<LNodeAttributes>;
  name: string;
  children: LNodeChild[] = [];
  mappedChildren: Record<string, LNodeChild> = {};
  component: Ref<Component | undefined>;

  constructor(name: string, attributes?: LNodeAttributes) {
    this.name = name;
    this.attributes = proxy<LNodeAttributes>(attributes || {});
    this.parent = ref<LNode | undefined>(undefined);
    this.component = ref<Component | undefined>(undefined);
    this.key = this.attributes.key || '';

    for (const dep of this.attributes.deps || []) {
      dep.subscribe({
        get: () => {
         // if (!this.component.value) {
         //   this.invalidate();
         // }
        },
        set: () => {
          this.invalidate();
        }
      })
    }
  }

  invalidate() {
    if (!this.parent.value) return;
    if (this.el) {
      const component = this.component.value;
      if (component) {
        const next = unwrapComponentTree(component);
        const nextEl = next.getElement();
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

  ensureElement(forceNew: boolean = false) {
    if (forceNew) return document.createElement(this.name);
    if (this.el) return this.el;
    const el = document.createElement(this.name);
    this.el = el;
    return el;
  }

  getElement(forceNew: boolean = false) {
    if (this.el) return this.el;
    return this.render(forceNew);
  }

  appendChild(child: LNodeChild) {
    const unwrapped = unwrapComponentTree(child);
    if (isComponent(child)) {
      unwrapped.component.value = child;
    }
    const key = unwrapped.key;
    const el = this.ensureElement();
    unwrapped.mountTo(el);
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
    this.mappedChildren[key] = child; 
    unwrapped.parent.value = this;
  }

  render(forceNew: boolean = false) {
    const el = this.ensureElement(forceNew);
    if (this.attributes.text) {
      el.innerHTML = '';
      el.innerText = unref(this.attributes.text) + '';
    }
    for (const [key, value] of Object.entries(this.attributes.on || {})) {
      el.addEventListener(key, value);
    }
    for (const [key, value] of Object.entries(this.attributes)) {
      if (['text', 'children', 'on'].includes(key)) continue;
      if (typeof value !== 'string') continue;
      el.setAttribute(key, value);
    }
    for (const child of (this.attributes.children || [])) {
      this.appendChild(child);
    }
    return el;
  }
}


export const lnode = (name: string, attributes?: LNodeAttributes) => new LNode(name, attributes); 


export const isLNode = (x: any): x is LNode => typeof x === 'object' && x._lnode === 'lnode'
