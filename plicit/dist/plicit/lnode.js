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
    constructor(name, attributes) {
        this.name = attributes.tag || name;
        this.attributes = (0, proxy_1.proxy)(attributes || {});
        this.parent = (0, proxy_1.ref)(undefined);
        this.component = (0, proxy_1.ref)(undefined);
        this.key = this.attributes.key || "";
        this.type = this.attributes.nodeType || this.type;
        for (const dep of this.attributes.deps || []) {
            (0, subscribe_1.deepSubscribe)(dep, {
                onSet: () => {
                    queueMicrotask(() => {
                        this.invalidate();
                    });
                },
            }, 1);
            //const d = unwrapReactiveDep(dep);
            //if (isRef(d)) {
            //  d.subscribe({
            //    get: () => {},
            //    set: () => {
            //      this.invalidate();
            //    },
            //  });
            //}
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
            const next = this.render(true);
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
        target.appendChild(el);
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
    _listenForMutation() {
        const el = this.el;
        if (!el)
            return;
        if (!(0, types_1.isHTMLElement)(el))
            return;
        const observer = new MutationObserver(function (mutations) {
            if (document.contains(el)) {
                observer.disconnect();
            }
        });
        observer.observe(el, {
            childList: true,
            attributes: true,
        });
    }
    setElement(el) {
        this.el = el;
    }
    ensureElement(forceNew = false) {
        if (forceNew)
            return this.createElement();
        if (this.el)
            return this.el;
        const el = this.createElement();
        this.setElement(el);
        return el;
    }
    getElement(forceNew = false) {
        if (this.el && !forceNew)
            return this.el;
        return this.render(forceNew);
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
        if ((0, signal_1.isSignal)(child)) {
            child.emitter.addEventListener(event_2.ESignalEvent.AFTER_UPDATE, (event) => {
                const sig = event.target;
                const lnode = sig.node._value;
                const thisEl = this.el;
                if ((0, exports.isLNode)(lnode)) {
                    console.log('yes');
                    if (thisEl && (0, types_1.isHTMLElement)(thisEl)) {
                        const index = this.children.indexOf(child);
                        if (index >= 0) {
                            const myChild = Array.from(thisEl.children)[index];
                            const nextEl = lnode.render();
                            if (myChild) {
                                if ((0, types_1.isHTMLElement)(myChild) && (0, types_1.isHTMLElement)(nextEl)) {
                                    (0, element_1.patchElements)(myChild, nextEl, () => { });
                                }
                                else {
                                    myChild.replaceWith(nextEl);
                                }
                            }
                        }
                    }
                }
            });
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
        if ((0, types_1.isText)(el))
            return;
        this.mappedChildren[key] = child;
        if ((0, exports.isLNode)(unreffed)) {
            unreffed.parent.value = this;
            unreffed.mountTo(el);
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
    render(forceNew = false) {
        const _this = this;
        setTimeout(() => {
            this.emit({ type: nodeEvents_1.ENodeEvent.MOUNTED, payload: {} });
            this.emit({ type: nodeEvents_1.ENodeEvent.LOADED, payload: {} });
            if (this.attributes.ref) {
                this.attributes.ref.value = _this;
            }
        }, 1000);
        const el = this.ensureElement(forceNew);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L2xub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxRTtBQUNyRSwyQ0FBMEU7QUFDMUUsK0JBQXdEO0FBQ3hELHVDQUFxRTtBQUNyRSxtQ0FBMEU7QUFDMUUsbUNBU2lCO0FBQ2pCLG1DQUEwQztBQUMxQyw2Q0FBMEM7QUFDMUMsMkNBQTRDO0FBQzVDLHFDQUFpRDtBQUNqRCwwQ0FBOEM7QUFNOUMsSUFBWSxVQUdYO0FBSEQsV0FBWSxVQUFVO0lBQ3BCLGlDQUFtQixDQUFBO0lBQ25CLDJDQUE2QixDQUFBO0FBQy9CLENBQUMsRUFIVyxVQUFVLDBCQUFWLFVBQVUsUUFHckI7QUFvQkQsTUFBTSxTQUFTLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUM7QUFFcEMsTUFBYSxLQUFLO0lBQ2hCLE1BQU0sR0FBWSxPQUFrQixDQUFDO0lBQ3JDLEdBQUcsR0FBVyxFQUFFLENBQUM7SUFDakIsRUFBRSxDQUF1RDtJQUN6RCxNQUFNLENBQXlCO0lBQy9CLFVBQVUsQ0FBMEI7SUFDcEMsSUFBSSxDQUFTO0lBQ2IsUUFBUSxHQUFpQixFQUFFLENBQUM7SUFDNUIsY0FBYyxHQUErQixFQUFFLENBQUM7SUFDaEQsU0FBUyxDQUE2QjtJQUN0QyxNQUFNLENBQTRCO0lBQ2xDLElBQUksR0FBZSxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ3RDLEdBQUcsR0FBVyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sR0FBc0QsSUFBSSxvQkFBWSxFQUl6RSxDQUFDO0lBRUosUUFBUSxHQUFZLEtBQUssQ0FBQztJQUUxQixZQUFZLElBQVksRUFBRSxVQUE0QjtRQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBQSxhQUFLLEVBQWtC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