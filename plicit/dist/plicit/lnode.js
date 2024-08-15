"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLNode = exports.lnode = exports.LNode = exports.ELNodeType = void 0;
const event_1 = require("./event");
const component_1 = require("./component");
const css_1 = require("./css");
const element_1 = require("./element");
const types_1 = require("./types");
const utils_1 = require("./utils");
const nodeEvents_1 = require("./nodeEvents");
const reactivity_1 = require("./reactivity");
const reactivity_2 = require("./reactivity");
var ELNodeType;
(function (ELNodeType) {
    ELNodeType["ELEMENT"] = "ELEMENT";
    ELNodeType["TEXT_ELEMENT"] = "TEXT_ELEMENT";
    ELNodeType["FRAGMENT"] = "FRAGMENT";
})(ELNodeType || (exports.ELNodeType = ELNodeType = {}));
const stringGen = (0, utils_1.stringGenerator)();
class LNode {
    _lnode = "lnode";
    key = "";
    el;
    parent;
    attributes;
    name;
    children = [];
    mappedChildren = {};
    component;
    signal;
    type = ELNodeType.ELEMENT;
    uid = stringGen.next(16);
    events = new event_1.EventEmitter();
    didMount = false;
    unsubs = [];
    constructor(name, attributes) {
        this.name = attributes.tag || name;
        this.attributes = (0, reactivity_2.proxy)(attributes || {});
        this.parent = (0, reactivity_1.signal)(undefined);
        this.component = (0, reactivity_1.ref)(undefined);
        this.key = this.attributes.key || "";
        this.type = this.attributes.nodeType || this.type;
        const deps = this.attributes.deps || [];
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
            this.el = (0, element_1.patchElements)(old, nextEl, ([key, value]) => {
                this.attributes[key] = value;
            });
        }
    }
    invalidate() {
        if (!this.parent.get())
            return;
        const old = this.el;
        if (!old)
            return;
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
    emit(event) {
        queueMicrotask(() => {
            this.events.emit({ ...event, target: this });
            switch (event.type) {
                case nodeEvents_1.ENodeEvent.MOUNTED:
                    {
                        if (this.attributes.onMounted) {
                            this.attributes.onMounted(this);
                        }
                        if (this.attributes.ref) {
                            this.attributes.ref.value = this;
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
        if (this.attributes.nodeType === ELNodeType.FRAGMENT) {
            target.append(...Array.from(el.childNodes));
        }
        else {
            target.appendChild(el);
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.MOUNTED, payload: {} });
    }
    createElement() {
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
    setElement(el) {
        this.el = el;
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
    onReceiveChild(child) {
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
                                this.appendChild(child);
                            }
                        },
                        onTrigger: () => {
                            this.appendChild(child);
                        },
                    });
                }
            });
        }
    }
    patchChildWithNode(index, newNode) {
        const thisEl = this.el;
        if (!thisEl || !(0, types_1.isHTMLElement)(thisEl))
            return;
        const myChild = Array.from(thisEl.children)[index];
        const nextEl = newNode.render();
        if (myChild) {
            if ((0, types_1.isHTMLElement)(myChild) && (0, types_1.isHTMLElement)(nextEl)) {
                (0, element_1.patchElements)(myChild, nextEl);
            }
            else {
                myChild.replaceWith(nextEl);
            }
        }
    }
    patchChildFromSignal(child, sig) {
        const lnode = (0, component_1.unwrapComponentTree)(sig.node._value);
        if ((0, exports.isLNode)(lnode)) {
            const index = this.children.indexOf(child);
            if (index >= 0) {
                this.patchChildWithNode(index, lnode);
            }
        }
    }
    appendChild(child) {
        if ((0, reactivity_1.isSignal)(child)) {
            const sig = child;
            child.emitter.addEventListener(reactivity_2.ESignalEvent.AFTER_UPDATE, (event) => {
                this.patchChildFromSignal(child, event.target);
            });
            child = child.get();
            if ((0, exports.isLNode)(child)) {
                child.signal = sig;
            }
        }
        const unwrapped = (0, component_1.unwrapComponentTree)(child);
        let unreffed = (0, reactivity_1.unref)(unwrapped);
        let signalKey = undefined;
        if ((0, reactivity_1.isSignal)(unreffed)) {
            unreffed = unreffed.get();
            signalKey = unreffed.uid;
        }
        if ((0, exports.isLNode)(child)) {
            child.parent.set(this);
        }
        const key = signalKey || unreffed.key;
        const el = this.ensureElement();
        if (!this.children.includes(child)) {
            this.children.push(child);
            this.onReceiveChild(child);
        }
        this.mappedChildren[key] = child;
        if ((0, exports.isLNode)(unreffed)) {
            unreffed.parent.set(this);
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
        if ((0, types_1.isText)(this.el))
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
        const _this = this;
        queueMicrotask(() => {
            this.emit({ type: nodeEvents_1.ENodeEvent.MOUNTED, payload: {} });
            this.emit({ type: nodeEvents_1.ENodeEvent.LOADED, payload: {} });
            if (this.attributes.ref) {
                this.attributes.ref.value = _this;
            }
        });
        const el = this.ensureElement();
        if (this.attributes.text) {
            if ((0, types_1.isText)(el)) {
                el.data = this.attributes.text;
            }
            else if (!(0, types_1.isSVGElement)(el) && !(0, types_1.isSVGPathElement)(el)) {
                el.innerHTML = "";
                el.innerText = (0, reactivity_1.unref)(this.attributes.text) + "";
            }
        }
        const style = this.attributes.style;
        if (style) {
            if (!(0, types_1.isText)(el)) {
                this.setAttribute("style", typeof style === "string" ? style : (0, css_1.cssPropsToString)(style));
            }
        }
        for (const [key, value] of Object.entries(this.attributes.on || {})) {
            el.addEventListener(key, value);
        }
        for (const [key, value] of Object.entries(this.attributes)) {
            if (["text", "children", "on", "style", "nodeType"].includes(key))
                continue;
            if (typeof value !== "string")
                continue;
            if ((0, types_1.isText)(el))
                continue;
            this.setAttribute(key, value);
        }
        const attrChildren = this.attributes.children || [];
        for (let i = 0; i < attrChildren.length; i++) {
            const child = attrChildren[i];
            this.appendChild(child);
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.LOADED, payload: {} });
        return el;
    }
}
exports.LNode = LNode;
const lnode = (name, attributes) => new LNode(name, attributes);
exports.lnode = lnode;
const isLNode = (x) => x !== null && !!x && typeof x === "object" && x._lnode === "lnode";
exports.isLNode = isLNode;
//# sourceMappingURL=lnode.js.map