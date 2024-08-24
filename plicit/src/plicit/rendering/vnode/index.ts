import { EventEmitter, EventSubscriber } from "../../event";
import { isPrimitive } from "../../is";
import { isSignal, pget, watchSignal } from "../../reactivity";
import { VNodeNativeElement } from "../dom/types";
import { EVNodeEvent, VNodeEvent, VNodeEventEmitter, VNodeEventMap } from "./event";
import { VNodeProps } from "./props";
import { EVNodeType } from "./types";



export class VNode {
  sym: 'VNode' = 'VNode';
  type: EVNodeType = EVNodeType.ELEMENT;
  name: string;
  children: VNode[] = [];
  props: VNodeProps = {};
  emitter: VNodeEventEmitter = new EventEmitter();
  el?: VNodeNativeElement; 

  constructor(name: string, props: VNodeProps) {
    this.type = props._type || this.type;
    this.name = name;
    this.props = props;

    this.create();

    if (this.props._signal) {
      if (isSignal(this.props._signal)) {
        watchSignal(this.props._signal, (next) => {
        }, { immediate: true })
      }
    }
  }

  updateRef(el: VNodeNativeElement)  {
    this.el = el;
    const ref = this.props.ref;
    if (!ref) return;
    ref.set(() => this);
  }

  create() {
    const props = this.props;
    for (const [key, value] of Object.entries(props)) {
      this.setAttribute(key, value);
    }

    for (const child of pget(props.children || [])) {
      this.appendChild(child);
    }
    
    this.emit({ type: EVNodeEvent.CREATED, payload: {} });
  }
  
  emit(event: Omit<VNodeEvent, 'target'>) {
    this.emitter.emit({...event, target: this});
  }

  addEventListener<K extends EVNodeEvent>(evtype: K, fun: EventSubscriber<VNodeEventMap[K]['payload'], K, VNode>) {
    return this.emitter.addEventListener(evtype, fun);
  }

  appendChild(child: VNode) {
    if (this.children.includes(child)) {
      // TODO: patch
      this.emit({ type: EVNodeEvent.CHILD_PATCH, payload: { child } })
    } else {
      this.children.push(child);
      this.emit({ type: EVNodeEvent.CHILD_INSERT, payload: { child } })
    }
  }

  setAttribute(key: string, value: any) {
    if (isPrimitive(value) && this.props[key] === value) return;
    this.props[key] = value;
    this.emit({ type: EVNodeEvent.PROP_UPDATE, payload: { key, value } });
  }

  hasChild(child: VNode) {
    return this.children.includes(child);
  }

  getChildIndex(child: VNode) {
    return this.children.indexOf(child);
  }

  removeChild(child: VNode) {
    if (!this.hasChild(child)) return;
    this.children = this.children.filter(it => it !== child);
    this.emit({ type: EVNodeEvent.CHILD_REMOVE, payload: { child } });
  }
}

export const vnode = (name: string, props: VNodeProps) => {
  return new VNode(name, props);
}

export const isVNode = (x: any): x is VNode => {
  if (typeof x === 'undefined' || x === null) return false;
  return x.sym === 'VNode';
}
