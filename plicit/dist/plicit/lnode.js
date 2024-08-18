"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLNode = exports.none = exports.lnode = exports.LNode = exports.ELNodeType = void 0;
const event_1 = require("./event");
const component_1 = require("./component");
const css_1 = require("./css");
const element_1 = require("./element");
const types_1 = require("./types");
const nodeEvents_1 = require("./nodeEvents");
const reactivity_1 = require("./reactivity");
const reactivity_2 = require("./reactivity");
var ELNodeType;
(function (ELNodeType) {
    ELNodeType["ELEMENT"] = "ELEMENT";
    ELNodeType["TEXT_ELEMENT"] = "TEXT_ELEMENT";
    ELNodeType["FRAGMENT"] = "FRAGMENT";
    ELNodeType["EMPTY"] = "EMPTY";
    ELNodeType["COMMENT"] = "COMMENT";
    ELNodeType["SLOT"] = "SLOT";
})(ELNodeType || (exports.ELNodeType = ELNodeType = {}));
class LNode {
    _lnode = "lnode";
    _id = 0;
    _idCounter = 0;
    isRoot = false;
    isTrash = false;
    key = "";
    el;
    parent;
    attributes;
    name;
    children = [];
    component;
    signal;
    type = ELNodeType.ELEMENT;
    slots = {};
    events = new event_1.EventEmitter();
    unsubs = [];
    constructor(name, attributes) {
        this.name = (0, reactivity_1.pget)(attributes.tag || name);
        this.attributes = attributes || {};
        this.parent = (0, reactivity_1.signal)(undefined);
        this.component = (0, reactivity_1.ref)(undefined);
        this.key = (0, reactivity_1.pget)(this.attributes.key || "");
        this.type = (0, reactivity_1.pget)(this.attributes.nodeType || this.type);
        this.isRoot = (0, reactivity_1.pget)(this.attributes.isRoot) || false;
        const deps = (0, reactivity_1.pget)(this.attributes.deps || []);
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            const nextUnsubs = (0, reactivity_2.deepSubscribe)(dep, {
                onSet: () => {
                    this.invalidate();
                },
                onTrigger: () => {
                    this.invalidate();
                },
            }, -1);
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
            this.signal.dispose();
        }
        this.isTrash = true;
        const attribs = Object.values(this.attributes);
        for (const attrib of attribs) {
            if ((0, reactivity_1.isSignal)(attrib)) {
                attrib.dispose();
            }
        }
    }
    toObject() {
        return {
            name: this.name,
            el: this.el,
            type: this.type,
            children: (0, reactivity_1.pget)(this.attributes.children || []).map((child) => {
                const unwrapped = (0, component_1.unwrapComponentTree)(child);
                const unreffed = (0, reactivity_1.pget)(unwrapped);
                if ((0, exports.isLNode)(unreffed))
                    return unreffed.toObject();
                return unreffed;
            }),
        };
    }
    setId(id) {
        if (id === this._id)
            return;
        this._id = id;
    }
    patchWith(other) {
        const old = this.el;
        if (!old)
            return;
        const next = (0, component_1.unwrapComponentTree)(other);
        let unreffed = (0, reactivity_1.unref)(next);
        if ((0, reactivity_1.isSignal)(unreffed)) {
            unreffed = unreffed.get();
        }
        const nextEl = unreffed.getElement();
        if ((0, exports.isLNode)(next)) {
            next.unsubs.forEach((unsub) => unsub());
            next.unsubs = [];
            if (next.parent) {
                next.parent.dispose();
            }
            if (next.signal) {
                next.signal.dispose();
            }
        }
        if ((0, types_1.isHTMLElement)(old) && (0, types_1.isHTMLElement)(nextEl)) {
            if ((0, exports.isLNode)(next)) {
                if (old.innerHTML === nextEl.innerHTML &&
                    JSON.stringify(Array.from(old.attributes).map((it) => it.value)) ===
                        JSON.stringify(Array.from(nextEl.attributes).map((it) => it.value))) {
                    return;
                }
            }
            this.setElement((0, element_1.patchElements)(old, nextEl, {
                attributeCallback: ([key, value]) => {
                    this.attributes[key] = value;
                },
                onBeforeReplace: (_old, _next) => {
                    this.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_REPLACE, payload: {} });
                },
                onAfterReplace: (_old, _next) => {
                    this.emit({ type: nodeEvents_1.ENodeEvent.AFTER_REPLACE, payload: {} });
                },
            }));
        }
    }
    invalidate() {
        //if (!this.parent.get()) return;
        //const old = this.el;
        //if (!old) return;
        const component = this.component.value;
        if (component) {
            if (this.el) {
                this.patchWith(component);
                return;
            }
            else {
                console.log("Did we not have an element?");
            }
        }
        console.log("did we end up here?");
        this.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_REPLACE, payload: {} });
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
    emit(event) {
        queueMicrotask(() => {
            this.events.emit({ ...event, target: this });
            switch (event.type) {
                case nodeEvents_1.ENodeEvent.BEFORE_REPLACE:
                    {
                        this._idCounter = 0;
                    }
                    break;
                case nodeEvents_1.ENodeEvent.RECEIVE_PARENT:
                    {
                        // noop
                    }
                    break;
                case nodeEvents_1.ENodeEvent.MOUNTED:
                    {
                        if (this.attributes.onMounted) {
                            this.attributes.onMounted(this);
                        }
                    }
                    break;
                case nodeEvents_1.ENodeEvent.LOADED:
                    {
                        if (this.attributes.onLoaded) {
                            this.attributes.onLoaded(this);
                        }
                    }
                    break;
            }
        });
    }
    addEventListener(evtype, sub) {
        return this.events.addEventListener(evtype, sub);
    }
    mountTo(target) {
        if (!target)
            return;
        const el = this.getElement();
        if (this.attributes.nodeType === ELNodeType.FRAGMENT &&
            !(0, types_1.isComment)(target)) {
            target.append(...Array.from(el.childNodes));
        }
        else {
            target.appendChild(el);
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.MOUNTED, payload: {} });
    }
    createElement() {
        if (this.type === ELNodeType.COMMENT) {
            return document.createComment(`comment`);
        }
        if (types_1.SVG_NAMES.includes(this.name)) {
            return document.createElementNS(`http://www.w3.org/2000/svg`, this.name);
        }
        if (this.name === "svg") {
            return document.createElementNS("http://www.w3.org/2000/svg", "svg");
        }
        else if (this.name === "path") {
            return document.createElementNS("http://www.w3.org/2000/svg", "path");
        }
        if (this.type === ELNodeType.TEXT_ELEMENT)
            return document.createTextNode(this.attributes.text || "");
        return document.createElement(this.name);
    }
    listenForMutation(callback) {
        const el = this.el;
        if (!el)
            return;
        if (!(0, types_1.isHTMLElement)(el))
            return;
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
    setElement(el) {
        this.el = el;
        this.updateRef();
    }
    ensureElement() {
        if (this.el)
            return this.el;
        const el = this.createElement();
        this.setElement(el);
        return el;
    }
    getElement() {
        if (this.el)
            return this.el;
        return this.render();
    }
    getSlot(name) {
        this.slots[name] ??= (0, reactivity_1.ref)(undefined);
        return this.slots[name];
    }
    setSlot(name, node) {
        const slot = this.getSlot(name);
        slot.value = node;
    }
    onReceiveChild(child, childIndex) {
        if ((0, exports.isLNode)(child) && child.type === ELNodeType.SLOT) {
            const name = child.attributes.name;
            if (typeof name !== "string") {
                console.warn(`Invalid slot name: ${name}`);
                return;
            }
            this.setSlot(name, child);
        }
        if ((0, reactivity_1.isRef)(child)) {
            child._deps.forEach((d) => {
                const un = (0, reactivity_2.unwrapReactiveDep)(d);
                if ((0, reactivity_1.isRef)(un)) {
                    un.subscribe({
                        onGet: (_target, key) => {
                            if (key === "value") {
                                (0, reactivity_1.unref)(child).invalidate();
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
    patchChildWithNode(index, newNode) {
        const thisEl = this.el;
        if (!thisEl)
            return;
        const myChild = (0, types_1.isElementWithChildren)(thisEl)
            ? Array.from(thisEl.children)[index]
            : null;
        const nextEl = newNode.render();
        const oldNode = this.children[index]
            ? (0, reactivity_1.pget)((0, component_1.unwrapComponentTree)(this.children[index]))
            : null;
        if (myChild) {
            if ((0, types_1.isHTMLElement)(myChild) && (0, types_1.isHTMLElement)(nextEl)) {
                (0, element_1.patchElements)(myChild, nextEl, {
                    onBeforeReplace: (_old, _next) => {
                        if (oldNode && (0, exports.isLNode)(oldNode)) {
                            oldNode.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_REPLACE, payload: {} });
                        }
                    },
                    onAfterReplace: (_old, _next) => {
                        if (oldNode && (0, exports.isLNode)(oldNode)) {
                            oldNode.emit({ type: nodeEvents_1.ENodeEvent.AFTER_REPLACE, payload: {} });
                        }
                    },
                });
            }
            else {
                if ((0, types_1.isReplaceableElement)(myChild)) {
                    myChild.replaceWith(nextEl);
                }
            }
        }
        else {
            if ((0, types_1.isElementWithChildren)(thisEl)) {
                const childs = Array.from(thisEl.children);
                if (childs.length <= 0) {
                    thisEl.appendChild(nextEl);
                }
            }
        }
    }
    patchChildFromSignal(child, sig, _childIndex) {
        const node = (0, component_1.unwrapComponentTree)(sig.node._value);
        if ((0, exports.isLNode)(node)) {
            const index = this.children.indexOf(child);
            if (index >= 0) {
                this.patchChildWithNode(index, node);
                node.setId(this._id + index);
            }
        }
        else if (node === null) {
            // TODO: allow null children to indicate that nothing will be rendered
        }
    }
    appendChild(child, childIndex) {
        if ((0, reactivity_1.isSignal)(child)) {
            const sig = child;
            child.emitter.addEventListener(reactivity_2.ESignalEvent.AFTER_UPDATE, (event) => {
                this.patchChildFromSignal(child, event.target, childIndex);
            });
            child = child.get();
            if ((0, exports.isLNode)(child)) {
                child.signal = sig;
            }
        }
        const unwrapped = (0, component_1.unwrapComponentTree)(child);
        let unreffed = (0, reactivity_1.pget)(unwrapped);
        if ((0, exports.isLNode)(child)) {
            child.parent.set(this);
            this.emit({ type: nodeEvents_1.ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });
        }
        const el = this.ensureElement();
        if (!this.children.includes(child)) {
            this.children.push(child);
            this.onReceiveChild(child, childIndex);
        }
        if ((0, exports.isLNode)(unreffed)) {
            unreffed.parent.set(this);
            unreffed.setId(this._id + childIndex);
            this.emit({ type: nodeEvents_1.ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });
            if (!(0, types_1.isText)(el)) {
                unreffed.mountTo(el);
            }
            if ((0, component_1.isComponent)(child)) {
                unreffed.component.value = child;
            }
            if ((0, reactivity_1.isSignal)(unwrapped)) {
                unreffed.signal = unwrapped;
            }
            else if ((0, reactivity_1.isSignal)(child)) {
                unreffed.signal = child;
            }
        }
    }
    setAttribute(key, value) {
        if (!this.el)
            return;
        if ((0, types_1.isText)(this.el) || (0, types_1.isComment)(this.el))
            return;
        if (!["innerHTML"].includes(key)) {
            this.el.setAttribute(key, value);
        }
        if (key === "value") {
            this.el.value = value;
        }
        else if (key === "innerHTML") {
            this.el.innerHTML = value;
        }
    }
    render() {
        const el = this.ensureElement();
        if (this.attributes.text) {
            if ((0, types_1.isText)(el) || (0, types_1.isComment)(el)) {
                el.data = this.attributes.text;
            }
            else if (!(0, types_1.isSVGElement)(el) &&
                !(0, types_1.isSVGPathElement)(el) &&
                !(0, types_1.isSVGSVGElement)(el)) {
                el.innerHTML = "";
                // @ts-ignore
                el.innerText = (0, reactivity_1.unref)(this.attributes.text) + "";
            }
        }
        const style = this.attributes.style;
        if (style && !(0, types_1.isText)(el)) {
            if ((0, reactivity_1.isSignal)(style)) {
                this.unsubs.push((0, reactivity_1.watchSignal)(style, () => {
                    const styleValue = (0, reactivity_1.pget)(style);
                    this.setAttribute("style", typeof styleValue === "string"
                        ? styleValue
                        : (0, css_1.cssPropsToString)(styleValue));
                }, { immediate: true }));
            }
            else {
                this.setAttribute("style", typeof style === "string" ? style : (0, css_1.cssPropsToString)(style));
            }
        }
        const clazz = this.attributes.class;
        if (clazz && !(0, types_1.isText)(el)) {
            if ((0, reactivity_1.isSignal)(clazz)) {
                this.unsubs.push((0, reactivity_1.watchSignal)(clazz, () => {
                    const classValue = (0, reactivity_1.pget)(clazz);
                    this.setAttribute("class", classValue);
                }, { immediate: true }));
            }
            else {
                this.setAttribute("class", clazz);
            }
        }
        for (const [key, value] of Object.entries(this.attributes.on || {})) {
            el.addEventListener(key, value);
        }
        if (!(0, types_1.isText)(el)) {
            for (const [key, value] of Object.entries(this.attributes)) {
                if (["text", "children", "on", "style", "nodeType", "class"].includes(key))
                    continue;
                if (!(typeof value == "string" || typeof value === "number"))
                    continue;
                this.setAttribute(key, value + "");
            }
        }
        const attrChildren = (0, reactivity_1.pget)(this.attributes.children || []);
        for (let i = 0; i < attrChildren.length; i++) {
            const child = attrChildren[i];
            if ((0, exports.isLNode)(child)) {
                child.setId(this._id + i);
            }
            this.appendChild(child, i);
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.LOADED, payload: {} });
        return el;
    }
}
exports.LNode = LNode;
const lnode = (name, attributes) => new LNode(name, attributes);
exports.lnode = lnode;
// TODO: remove this and allow `null` as children to indicate that nothing should render
const none = () => (0, exports.lnode)("span", {
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
exports.none = none;
const isLNode = (x) => x !== null && !!x && typeof x === "object" && x._lnode === "lnode";
exports.isLNode = isLNode;
//# sourceMappingURL=lnode.js.map