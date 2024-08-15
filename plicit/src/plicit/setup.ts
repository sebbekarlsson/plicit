import { Component } from "./component";
import { ELNodeType, lnode } from "./lnode";


type GlobalSetupState = {
  setup?: () => void
}

export const GSetupState: GlobalSetupState = {};

export const setup = (component: Component, el: HTMLElement | Element) => {

  const fun = () => {
    el.innerHTML = '';
    const main = lnode('div', {
      nodeType: ELNodeType.FRAGMENT,
      children: [
        component
      ]
    });

    main.mountTo(el);
  }

  fun();

  GSetupState.setup = fun;
}
