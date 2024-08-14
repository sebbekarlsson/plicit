import { Component } from "./component";
import { ELNodeType, lnode } from "./lnode";

export const setup = (component: Component, el: HTMLElement | Element) => {
  const main = lnode('div', {
    nodeType: ELNodeType.FRAGMENT,
    children: [
      component
    ]
  });

  main.mountTo(el);
}
