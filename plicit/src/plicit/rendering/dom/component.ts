import { mountVNode } from ".";
import { isVComponent, VComponent } from "../component/types";
import { VNodeProps } from "../vnode/props";

export const mountComponent = (component: VComponent, target: Element, props: VNodeProps = {}) => {
  const next = component(props);
  if (isVComponent(next)) return mountComponent(next, target, props);
  return mountVNode(next, target);
}
