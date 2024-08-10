import { Component } from "./component";
import { lnode } from "./lnode";

export const setup = (component: Component, el: HTMLElement | Element) => {
  const main = lnode('div', {
    children: [
      component
    ]
  });

  main.mountTo(el);
}
