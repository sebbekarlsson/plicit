import { cssPropsToString } from "../../css";
import { setElementAttribute } from "../../element";
import { isSignal, MaybeSignal, pget, watchSignal } from "../../reactivity";
import { isHTMLElement, isText, NativeElementListeners } from "../../types";
import { VNode } from "../vnode";
import { EVNodeEvent } from "../vnode/event";
import { EVNodeType } from "../vnode/types";

export const renderVNode = (node: MaybeSignal<VNode>): HTMLElement | Text => {
  if (isSignal(node)) {
    const tmp = document.createElement('div');

    watchSignal(node, (next) => {
      const el = renderVNode(next);
      tmp.replaceWith(el);
      next.updateRef(el);
    }, { immediate: true })

    return tmp;
  }
  const setAttribute = (key: string, value: any) => {
    if (isSignal(value)) {
      watchSignal(
        value,
        (val) => {
          setAttribute(key, val);
        },
        { immediate: true },
      );
      return;
    }

    switch (key) {
      case "style":
        {
          if (isHTMLElement(el)) {
            const style = cssPropsToString(value);
            el.setAttribute(key, style);
          }
        }
        break;
      case "text":
        {
          if (isText(el)) {
            el.data = pget(value) + "";
          } else {
            el.innerText = pget(value);
          }
        }
        break;
      case "on":
        {
          if (isHTMLElement(el)) {
            for (const [key, fun] of Object.entries(
              value as Partial<NativeElementListeners>,
            )) {
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
        if (isHTMLElement(el)) {
          setElementAttribute(el, key, value);
        }
      }
    }
  };

  node.addEventListener(EVNodeEvent.PROP_UPDATE, (event) => {
    setAttribute(event.payload.key, event.payload.value);
  });

  node.addEventListener(EVNodeEvent.CHILD_INSERT, (event) => {
    console.log("child insert");
  });

  const name = node.name || "div";
  const props = node.props;

  const createElement = () => {
    const createDOMElement = () => {
      switch (node.type) {
        case EVNodeType.TEXT:
          return document.createTextNode(pget(props.text) + "");
        case EVNodeType.FUNCTION: {
          if (node.props._component) {
            const fun = pget(node.props._component);
            const next = fun({});
            return renderVNode(next);
          }
        }; break;
        default:
        case EVNodeType.ELEMENT:
          return document.createElement(name);
      }
    };
    const el = createDOMElement();

    if (isHTMLElement(el)) {
      for (const child of node.children) {
        const childEl = renderVNode(child);
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

export const mountVNode = (node: VNode, target: Element) => {
  const el = renderVNode(node);
  target.innerHTML = "";
  target.append(el);
};
