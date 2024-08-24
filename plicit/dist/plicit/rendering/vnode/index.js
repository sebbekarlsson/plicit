"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVNode = exports.vnode = exports.VNode = void 0;
const event_1 = require("../../event");
const is_1 = require("../../is");
const reactivity_1 = require("../../reactivity");
const event_2 = require("./event");
const types_1 = require("./types");
class VNode {
    sym = 'VNode';
    type = types_1.EVNodeType.ELEMENT;
    name;
    children = [];
    props = {};
    emitter = new event_1.EventEmitter();
    el;
    constructor(name, props) {
        this.type = props._type || this.type;
        this.name = name;
        this.props = props;
        this.create();
        if (this.props._signal) {
            if ((0, reactivity_1.isSignal)(this.props._signal)) {
                (0, reactivity_1.watchSignal)(this.props._signal, (next) => {
                }, { immediate: true });
            }
        }
    }
    updateRef(el) {
        this.el = el;
        const ref = this.props.ref;
        if (!ref)
            return;
        ref.set(() => this);
    }
    create() {
        const props = this.props;
        for (const [key, value] of Object.entries(props)) {
            this.setAttribute(key, value);
        }
        for (const child of (0, reactivity_1.pget)(props.children || [])) {
            this.appendChild(child);
        }
        this.emit({ type: event_2.EVNodeEvent.CREATED, payload: {} });
    }
    emit(event) {
        this.emitter.emit({ ...event, target: this });
    }
    addEventListener(evtype, fun) {
        return this.emitter.addEventListener(evtype, fun);
    }
    appendChild(child) {
        if (this.children.includes(child)) {
            // TODO: patch
            this.emit({ type: event_2.EVNodeEvent.CHILD_PATCH, payload: { child } });
        }
        else {
            this.children.push(child);
            this.emit({ type: event_2.EVNodeEvent.CHILD_INSERT, payload: { child } });
        }
    }
    setAttribute(key, value) {
        if ((0, is_1.isPrimitive)(value) && this.props[key] === value)
            return;
        this.props[key] = value;
        this.emit({ type: event_2.EVNodeEvent.PROP_UPDATE, payload: { key, value } });
    }
    hasChild(child) {
        return this.children.includes(child);
    }
    getChildIndex(child) {
        return this.children.indexOf(child);
    }
    removeChild(child) {
        if (!this.hasChild(child))
            return;
        this.children = this.children.filter(it => it !== child);
        this.emit({ type: event_2.EVNodeEvent.CHILD_REMOVE, payload: { child } });
    }
}
exports.VNode = VNode;
const vnode = (name, props) => {
    return new VNode(name, props);
};
exports.vnode = vnode;
const isVNode = (x) => {
    if (typeof x === 'undefined' || x === null)
        return false;
    return x.sym === 'VNode';
};
exports.isVNode = isVNode;
//# sourceMappingURL=index.js.map