"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountVNode = exports.renderVNode = void 0;
const css_1 = require("../../css");
const element_1 = require("../../element");
const reactivity_1 = require("../../reactivity");
const types_1 = require("../../types");
const event_1 = require("../vnode/event");
const types_2 = require("../vnode/types");
const renderVNode = (node) => {
    if ((0, reactivity_1.isSignal)(node)) {
        const tmp = document.createElement('div');
        (0, reactivity_1.watchSignal)(node, (next) => {
            const el = (0, exports.renderVNode)(next);
            tmp.replaceWith(el);
            next.updateRef(el);
        }, { immediate: true });
        return tmp;
    }
    const setAttribute = (key, value) => {
        if ((0, reactivity_1.isSignal)(value)) {
            (0, reactivity_1.watchSignal)(value, (val) => {
                setAttribute(key, val);
            }, { immediate: true });
            return;
        }
        switch (key) {
            case "style":
                {
                    if ((0, types_1.isHTMLElement)(el)) {
                        const style = (0, css_1.cssPropsToString)(value);
                        el.setAttribute(key, style);
                    }
                }
                break;
            case "text":
                {
                    if ((0, types_1.isText)(el)) {
                        el.data = (0, reactivity_1.pget)(value) + "";
                    }
                    else {
                        el.innerText = (0, reactivity_1.pget)(value);
                    }
                }
                break;
            case "on":
                {
                    if ((0, types_1.isHTMLElement)(el)) {
                        for (const [key, fun] of Object.entries(value)) {
                            el.removeEventListener(key, fun);
                            el.addEventListener(key, fun);
                        }
                    }
                }
                break;
            case "children":
                {
                }
                break;
            default: {
                if ((0, types_1.isHTMLElement)(el)) {
                    (0, element_1.setElementAttribute)(el, key, value);
                }
            }
        }
    };
    node.addEventListener(event_1.EVNodeEvent.PROP_UPDATE, (event) => {
        setAttribute(event.payload.key, event.payload.value);
    });
    node.addEventListener(event_1.EVNodeEvent.CHILD_INSERT, (event) => {
        console.log("child insert");
    });
    const name = node.name || "div";
    const props = node.props;
    const createElement = () => {
        const createDOMElement = () => {
            switch (node.type) {
                case types_2.EVNodeType.TEXT:
                    return document.createTextNode((0, reactivity_1.pget)(props.text) + "");
                case types_2.EVNodeType.FUNCTION:
                    {
                        if (node.props._component) {
                            const fun = (0, reactivity_1.pget)(node.props._component);
                            const next = fun({});
                            return (0, exports.renderVNode)(next);
                        }
                    }
                    ;
                    break;
                default:
                case types_2.EVNodeType.ELEMENT:
                    return document.createElement(name);
            }
        };
        const el = createDOMElement();
        if ((0, types_1.isHTMLElement)(el)) {
            for (const child of node.children) {
                const childEl = (0, exports.renderVNode)(child);
                el.append(childEl);
            }
        }
        return el;
    };
    const el = createElement();
    for (const [key, value] of Object.entries(props)) {
        setAttribute(key, value);
    }
    node.updateRef(el);
    return el;
};
exports.renderVNode = renderVNode;
const mountVNode = (node, target) => {
    const el = (0, exports.renderVNode)(node);
    target.innerHTML = "";
    target.append(el);
};
exports.mountVNode = mountVNode;
//# sourceMappingURL=index.js.map