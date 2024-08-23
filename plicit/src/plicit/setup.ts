import { Component } from "./component";
import { ELNodeType, LNode, lnode } from "./lnode";
import { popScope, pushScope } from "./scope";

type GlobalSetupState = {
  setup?: () => void;
  root?: LNode;
};

export const GSetupState: GlobalSetupState = {};

export const setup = (component: Component, el: HTMLElement | Element) => {
  const fun = () => {
    el.innerHTML = "";
    const main = lnode("div", {
      nodeType: ELNodeType.FRAGMENT,
      isRoot: true,
      children: [component],
    });

    main.mountTo(el);
    GSetupState.root = main;
  };

  try {
    fun();
  } catch (e) {
    console.error(e);
  }

  GSetupState.setup = fun;
};
