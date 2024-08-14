"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLNode = exports.lnode = exports.LNode = exports.ELNodeType = void 0;
const event_1 = require("./event");
const component_1 = require("./component");
const css_1 = require("./css");
const element_1 = require("./element");
const proxy_1 = require("./proxy");
const types_1 = require("./types");
const utils_1 = require("./utils");
const nodeEvents_1 = require("./nodeEvents");
const subscribe_1 = require("./subscribe");
const signal_1 = require("./signal");
const event_2 = require("./signal/event");
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
        this.attributes = (0, proxy_1.proxy)(attributes || {});
        this.parent = (0, proxy_1.ref)(undefined);
        this.component = (0, proxy_1.ref)(undefined);
        this.key = this.attributes.key || "";
        this.type = this.attributes.nodeType || this.type;
        const deps = this.attributes.deps || [];
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            const nextUnsubs = (0, subscribe_1.deepSubscribe)(dep, {
                onSet: () => {
                    queueMicrotask(() => {
                        this.invalidate();
                    });
                },
            }, 1);
            this.unsubs = [...this.unsubs, ...nextUnsubs];
        }
    }
    patchWith(other) {
        const old = this.el;
        if (!old)
            return;
        const next = (0, component_1.unwrapComponentTree)(other);
        let unreffed = (0, proxy_1.unref)(next);
        if ((0, signal_1.isSignal)(unreffed)) {
            unreffed = unreffed.get();
        }
        const nextEl = unreffed.getElement();
        if ((0, exports.isLNode)(next)) {
            next.unsubs.forEach((unsub) => unsub());
            next.unsubs = [];
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
        if (!this.parent.value)
            return;
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
        if ((0, proxy_1.isRef)(child)) {
            child._deps.forEach((d) => {
                const un = (0, types_1.unwrapReactiveDep)(d);
                if ((0, proxy_1.isRef)(un)) {
                    un.subscribe({
                        onGet: (_target, key) => {
                            if (key === "value") {
                                (0, proxy_1.unref)(child).invalidate();
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
    appendChild(child) {
        const patchChild = () => {
            if ((0, signal_1.isSignal)(child)) {
                child.emitter.addEventListener(event_2.ESignalEvent.AFTER_UPDATE, (event) => {
                    const sig = event.target;
                    const lnode = sig.node._value;
                    const thisEl = this.el;
                    if ((0, exports.isLNode)(lnode)) {
                        if (thisEl && (0, types_1.isHTMLElement)(thisEl)) {
                            const index = this.children.indexOf(child);
                            if (index >= 0) {
                                const myChild = Array.from(thisEl.children)[index];
                                const nextEl = lnode.render();
                                if (myChild) {
                                    if ((0, types_1.isHTMLElement)(myChild) && (0, types_1.isHTMLElement)(nextEl)) {
                                        (0, element_1.patchElements)(myChild, nextEl);
                                    }
                                    else {
                                        myChild.replaceWith(nextEl);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        };
        if ((0, signal_1.isSignal)(child)) {
            patchChild();
            child = child.get();
        }
        const unwrapped = (0, component_1.unwrapComponentTree)(child);
        let unreffed = (0, proxy_1.unref)(unwrapped);
        let signalKey = undefined;
        if ((0, signal_1.isSignal)(unreffed)) {
            unreffed = unreffed.get();
            signalKey = unreffed.uid;
        }
        if ((0, exports.isLNode)(child)) {
            child.parent.value = this;
        }
        const key = signalKey || unreffed.key;
        const el = this.ensureElement();
        if (!this.children.includes(child)) {
            this.children.push(child);
            this.onReceiveChild(child);
        }
        this.mappedChildren[key] = child;
        if ((0, exports.isLNode)(unreffed)) {
            unreffed.parent.value = this;
            if (!(0, types_1.isText)(el)) {
                unreffed.mountTo(el);
            }
            if ((0, component_1.isComponent)(child)) {
                unreffed.component.value = child;
            }
            if ((0, signal_1.isSignal)(unwrapped)) {
                unreffed.signal = unwrapped;
            }
            else if ((0, signal_1.isSignal)(child)) {
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
                el.innerText = (0, proxy_1.unref)(this.attributes.text) + "";
            }
        }
        const style = this.attributes.style;
        if (style) {
            if (!(0, types_1.isText)(el)) {
                this.setAttribute("style", typeof style === "string" ? style : (0, css_1.cssPropsToString)(style));
            }
        }
        queueMicrotask(() => {
            for (const [key, value] of Object.entries(this.attributes.on || {})) {
                el.addEventListener(key, value);
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L2xub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxRTtBQUNyRSwyQ0FBMEU7QUFDMUUsK0JBQXdEO0FBQ3hELHVDQUEwQztBQUMxQyxtQ0FBMEU7QUFDMUUsbUNBU2lCO0FBQ2pCLG1DQUEwQztBQUMxQyw2Q0FBMEM7QUFDMUMsMkNBQTRDO0FBQzVDLHFDQUFpRDtBQUNqRCwwQ0FBOEM7QUFNOUMsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ3BCLGlDQUFtQixDQUFBO0lBQ25CLDJDQUE2QixDQUFBO0lBQzdCLG1DQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFKVyxVQUFVLDBCQUFWLFVBQVUsUUFJckI7QUFvQkQsTUFBTSxTQUFTLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUM7QUFFcEMsTUFBYSxLQUFLO0lBQ2hCLE1BQU0sR0FBWSxPQUFrQixDQUFDO0lBQ3JDLEdBQUcsR0FBVyxFQUFFLENBQUM7SUFDakIsRUFBRSxDQUF1RDtJQUN6RCxNQUFNLENBQXlCO0lBQy9CLFVBQVUsQ0FBMEI7SUFDcEMsSUFBSSxDQUFTO0lBQ2IsUUFBUSxHQUFpQixFQUFFLENBQUM7SUFDNUIsY0FBYyxHQUErQixFQUFFLENBQUM7SUFDaEQsU0FBUyxDQUE2QjtJQUN0QyxNQUFNLENBQTRCO0lBQ2xDLElBQUksR0FBZSxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ3RDLEdBQUcsR0FBVyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sR0FBc0QsSUFBSSxvQkFBWSxFQUl6RSxDQUFDO0lBRUosUUFBUSxHQUFZLEtBQUssQ0FBQztJQUMxQixNQUFNLEdBQXNCLEVBQUUsQ0FBQztJQUUvQixZQUFZLElBQVksRUFBRSxVQUE0QjtRQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLElBQUksSUFBSSxD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