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
      isRoot: true,
      children: [
        component
      ]
    });

    main.mountTo(el);
  }

  try {
    fun();
  } catch (e) {
    console.error(e);
  }

  GSetupState.setup = fun;
}
