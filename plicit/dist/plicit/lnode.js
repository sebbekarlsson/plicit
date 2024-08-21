"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapElement = exports.isLNode = exports.none = exports.lnodeX = exports.lnode = exports.LNode = exports.ELNodeType = void 0;
const event_1 = require("./event");
const component_1 = require("./component");
const css_1 = require("./css");
const element_1 = require("./element");
const types_1 = require("./types");
const nodeEvents_1 = require("./nodeEvents");
const reactivity_1 = require("./reactivity");
const constants_1 = require("./constants");
var ELNodeType;
(function (ELNodeType) {
    ELNodeType["ELEMENT"] = "ELEMENT";
    ELNodeType["TEXT_ELEMENT"] = "TEXT_ELEMENT";
    ELNodeType["FRAGMENT"] = "FRAGMENT";
    ELNodeType["EMPTY"] = "EMPTY";
    ELNodeType["COMMENT"] = "COMMENT";
    ELNodeType["SLOT"] = "SLOT";
    ELNodeType["COMPONENT"] = "COMPONENT";
    ELNodeType["SIGNAL"] = "COMPONENT";
})(ELNodeType || (exports.ELNodeType = ELNodeType = {}));
const INTERNAL_ATTRIBUTES = [
    "text",
    "children",
    "on",
    "style",
    "nodeType",
    "class",
    "watch",
    "__depth",
];
class LNode {
    _lnode = "lnode";
    isRoot = false;
    isTrash = false;
    key = "";
    el;
    parent;
    attributes;
    name;
    children = [];
    childNodes = [];
    component = undefined;
    type = ELNodeType.ELEMENT;
    resizeObserver = null;
    events = new event_1.EventEmitter();
    unsubs = [];
    constructor(name, attributes) {
        this.name = (0, reactivity_1.pget)(attributes.tag || name);
        this.attributes = attributes || {};
        this.parent = (0, reactivity_1.signal)(undefined);
        this.key = (0, reactivity_1.pget)(this.attributes.key || "");
        this.type = (0, reactivity_1.pget)(this.attributes.nodeType || this.type);
        this.isRoot = (0, reactivity_1.pget)(this.attributes.isRoot) || false;
        const deps = (0, reactivity_1.pget)(this.attributes.deps || []);
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            if ((0, reactivity_1.isSignal)(dep)) {
                this.addGC((0, reactivity_1.watchSignal)(dep, () => {
                    this.invalidate();
                }));
            }
        }
    }
    addGC(unsub) {
        if (this.unsubs.includes(unsub))
            return;
        this.unsubs.push(unsub);
    }
    teleport(newParent) {
        const parent = this.parent.get();
        if (!parent) {
            console.warn(`Cannot teleport a root node.`);
            return;
        }
        parent.removeChild(parent.childNodes.indexOf(this));
        const newParentEl = newParent.getElementOrRender();
        newParentEl.appendChild(this.getElementOrRender());
    }
    setChild(index, child) {
        if (this.childNodes[index] === child)
            return;
        const childEl = child.getElementOrRender();
        const thisEl = this.getElementOrRender();
        (0, element_1.setElementChild)(thisEl, childEl, index);
    }
    removeChild(index) {
        const node = this.childNodes[index];
        if (!node)
            return;
        if (node.el && this.el && this.el.contains(node.el)) {
            this.el.removeChild(node.el);
        }
        this.childNodes = this.childNodes.filter((it) => it !== node);
    }
    addChildNode(node) {
        if (this.childNodes.includes(node))
            return;
        this.childNodes.push(node);
    }
    emitBeforeUnmount() {
        this.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_UNMOUNT, payload: {} });
        this.getChildNodes().forEach((it) => it.emitBeforeUnmount());
    }
    emitUnmounted() {
        this.emit({ type: nodeEvents_1.ENodeEvent.UNMOUNTED, payload: {} });
        this.getChildNodes().forEach((it) => it.emitUnmounted());
    }
    emitCleanup() {
        this.emit({ type: nodeEvents_1.ENodeEvent.CLEANUP, payload: {} });
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
        const attr = (0, reactivity_1.pget)(this.attributes.children) || [];
        const childNodes = this.getChildNodes();
        return Math.max(attr.length, childNodes.length);
    }
    getChildElementNode(index) {
        if (!this.el)
            return null;
        return this.el.childNodes.item(index) || null;
    }
    getChildNodes() {
        return this.childNodes;
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
    patchWith(other) {
        const old = this.el;
        if (!old)
            throw new Error(`Expected an existing element.`);
        const next = (0, component_1.unwrapComponentTree)(other);
        let unreffed = (0, reactivity_1.pget)(next);
        if ((0, reactivity_1.isSignal)(unreffed)) {
            unreffed = unreffed.get();
        }
        const nextEl = unreffed.getElementOrRender();
        if ((0, exports.isLNode)(next)) {
            next.cleanup();
        }
        if ((0, types_1.isHTMLElement)(old) && (0, types_1.isHTMLElement)(nextEl)) {
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
        const component = this.attributes._component || this.component;
        if (component && this.el) {
            this.patchWith(component);
            return;
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_REPLACE, payload: {} });
        this.el = undefined;
        const next = this.render();
        if (next !== this.el) {
            this.el.replaceWith(next);
        }
        this.setElement(next);
        this.emit({ type: nodeEvents_1.ENodeEvent.AFTER_REPLACE, payload: {} });
    }
    updateRef() {
        if (this.attributes.ref) {
            this.attributes.ref.set(this);
            //this.attributes.ref.value = this;
        }
    }
    emit(event) {
        queueMicrotask(() => {
            this.events.emit({ ...event, target: this });
            switch (event.type) {
                case nodeEvents_1.ENodeEvent.BEFORE_REPLACE:
                    {
                    }
                    break;
                case nodeEvents_1.ENodeEvent.MOUNTED:
                    {
                        if (this.attributes.onMounted) {
                            //this.attributes.onMounted(this);
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
        const el = this.getElementOrRender();
        if (target.contains(el))
            return;
        if (this.attributes.nodeType === ELNodeType.FRAGMENT &&
            !(0, types_1.isComment)(target)) {
            target.append(...Array.from(el.childNodes));
        }
        else {
            target.appendChild(el);
        }
        if ((0, types_1.isHTMLElement)(el) && !this.resizeObserver && this.getChildCount() > 0) {
            let didContain = false;
            const obs = (this.resizeObserver = new ResizeObserver(() => {
                if (document.contains(el)) {
                    didContain = true;
                    this.emit({ type: nodeEvents_1.ENodeEvent.MOUNTED, payload: {} });
                }
                else if (didContain) {
                    obs.disconnect();
                    queueMicrotask(() => {
                        this.emitBeforeUnmount();
                        queueMicrotask(() => {
                            this.events.slots[nodeEvents_1.ENodeEvent.BEFORE_UNMOUNT] = [];
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
            }));
            obs.observe(el);
        }
    }
    createElement() {
        const create = () => {
            if (this.type === ELNodeType.SIGNAL) {
                const sig = this.attributes.signal;
                if ((0, reactivity_1.isSignal)(sig)) {
                    this.addGC((0, reactivity_1.watchSignal)(sig, (next) => {
                        if (!this.el)
                            return;
                        next.invalidate();
                        this.patchWith(next);
                        next.cleanup();
                    }, { immediate: true }));
                    return sig.get().getElementOrRender();
                }
            }
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
        };
        const el = create();
        return el;
    }
    setElement(el) {
        this.el = el;
        this.updateRef();
        return el;
    }
    getElementOrRender() {
        if (this.el)
            return this.el;
        return this.render();
    }
    getElementOrThrow() {
        if (this.el)
            return this.el;
        throw new Error(`Node did not have an element when it was expected.`);
    }
    patchChildWithNode(index, newNode) {
        const thisEl = this.el;
        if (!thisEl)
            return;
        if (!(0, exports.isLNode)(newNode)) {
            if (Array.isArray(newNode)) {
                const childs = newNode;
                childs.forEach((child, i) => this.appendChild(child, index + i));
                return;
            }
            throw new Error(`NOT A NODE`);
        }
        const myChild = this.getChildElementNode(index);
        //const myChild = isElementWithChildren(thisEl)
        //  ? Array.from(thisEl.children)[index]
        //  : null;
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
                const childs = Array.from(thisEl.childNodes);
                if (childs.length <= 0) {
                    thisEl.appendChild(nextEl);
                    this.addChildNode(newNode);
                }
            }
        }
    }
    appendChild(child, childIndex) {
        if ((0, reactivity_1.isSignal)(child)) {
            this.addGC((0, reactivity_1.watchSignal)(child, (next) => {
                this.patchChildWithNode(childIndex, (0, component_1.unwrapComponentTree)(next));
            }));
            child = child.get();
        }
        const unwrapped = (0, component_1.unwrapComponentTree)(child);
        let unreffed = (0, reactivity_1.pget)(unwrapped);
        if ((0, exports.isLNode)(child)) {
            child.parent.set(this);
            this.emit({ type: nodeEvents_1.ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });
        }
        const el = this.getElementOrThrow();
        if (!this.children.includes(child)) {
            this.children.push(child);
        }
        if ((0, exports.isLNode)(unreffed)) {
            unreffed.parent.set(this);
            this.emit({ type: nodeEvents_1.ENodeEvent.RECEIVE_PARENT, payload: { parent: this } });
            if (!(0, types_1.isText)(el)) {
                unreffed.mountTo(el);
            }
            if ((0, component_1.isComponent)(child)) {
                unreffed.component = child;
            }
            this.addChildNode(unreffed);
        }
    }
    setAttribute(key, value) {
        if (!this.el)
            return;
        if ((0, types_1.isText)(this.el) || (0, types_1.isComment)(this.el))
            return;
        if (!["innerHTML", "_value"].includes(key)) {
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
        this.emit({ type: nodeEvents_1.ENodeEvent.BEFORE_RENDER, payload: {} });
        this.childNodes = [];
        const el = this.setElement(this.el || this.createElement());
        if (this.attributes.text) {
            if ((0, types_1.isText)(el) || (0, types_1.isComment)(el)) {
                el.data = this.attributes.text;
            }
            else if (!(0, types_1.isSVGElement)(el) &&
                !(0, types_1.isSVGPathElement)(el) &&
                !(0, types_1.isSVGSVGElement)(el)) {
                el.innerHTML = "";
                // @ts-ignore
                el.innerText = (0, reactivity_1.pget)(this.attributes.text) + "";
            }
        }
        const watchedAttributes = [...((0, reactivity_1.pget)(this.attributes.watch) || []), ...constants_1.DEFAULT_WATCHED_NODE_PROPS];
        for (const key of watchedAttributes) {
            const attrib = this.attributes[key];
            if ((0, reactivity_1.isSignal)(attrib)) {
                this.addGC((0, reactivity_1.watchSignal)(attrib, (value) => {
                    this.setAttribute(key, value);
                }, { immediate: true }));
            }
        }
        const style = this.attributes.style;
        if (style && !(0, types_1.isText)(el)) {
            if ((0, reactivity_1.isSignal)(style)) {
                this.addGC((0, reactivity_1.watchSignal)(style, () => {
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
        if (!(0, types_1.isText)(el)) {
            if (clazz) {
                if ((0, reactivity_1.isSignal)(clazz)) {
                    this.addGC((0, reactivity_1.watchSignal)(clazz, () => {
                        const classValue = (0, reactivity_1.pget)(clazz);
                        this.setAttribute("class", (0, css_1.mergeClasses)(classValue));
                    }, { immediate: true }));
                }
                else {
                    this.setAttribute("class", (0, css_1.mergeClasses)(clazz));
                }
            }
        }
        for (const [key, value] of Object.entries(this.attributes.on || {})) {
            el.removeEventListener(key, value);
            el.addEventListener(key, value);
        }
        if (!(0, types_1.isText)(el)) {
            for (const [key, value] of Object.entries(this.attributes)) {
                if (INTERNAL_ATTRIBUTES.includes(key)) {
                    continue;
                }
                if (!(typeof value == "string" ||
                    typeof value === "number" ||
                    typeof value === "boolean"))
                    continue;
                this.setAttribute(key, value + "");
            }
        }
        const attrChildren = (0, reactivity_1.pget)(this.attributes.children || []);
        for (let i = 0; i < attrChildren.length; i++) {
            const child = attrChildren[i];
            this.appendChild(child, i);
        }
        this.emit({ type: nodeEvents_1.ENodeEvent.LOADED, payload: {} });
        //withCurrentScope((scope) => {
        //  console.log({ scope });
        //});
        return el;
    }
}
exports.LNode = LNode;
const lnode = (name, attributes) => new LNode(name, attributes);
exports.lnode = lnode;
const lnodeX = (nodeType, attributes = {}) => new LNode(nodeType, { ...attributes, nodeType: nodeType });
exports.lnodeX = lnodeX;
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
const unwrapElement = (sig) => (0, reactivity_1.pget)(sig)?.el;
exports.unwrapElement = unwrapElement;
//# sourceMappingURL=lnode.js.map