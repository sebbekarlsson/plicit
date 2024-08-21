import { insertAt } from "tsmathutil";
import { LNodeNativeElement } from "./lnode";
import { ElementWithAttributes, isAnySVGElement } from "./types";

export const setElementAttribute = (
  el: ElementWithAttributes,
  key: string,
  value: any,
) => {
  try {
    el.setAttribute(key, value);
  } catch (e) {
    console.warn(e);
    // @ts-ignore
  }


  if (!isAnySVGElement(el)) {
    try {
      (el as any)[key] = value;
    } catch (e) {
      console.warn(e);
    }
  }
};

export const getElementAttributes = (a: ElementWithAttributes): Attr[] => {
  return Array.from(a.attributes);
};

type KeyPair = [string, string];

export const getElementsAttributesDiff = (
  a: ElementWithAttributes,
  b: ElementWithAttributes,
): Array<KeyPair> => {
  const attributesB = getElementAttributes(b).map(
    (attr): KeyPair => [attr.name, attr.value],
  );
  return attributesB.filter(([key, value]) => a.getAttribute(key) !== value);
};

export const getElementsDiff = (
  a: ElementWithAttributes,
  b: ElementWithAttributes,
) => {
  return getElementsAttributesDiff(a, b);
};


type PatchElementsOptions = {
  attributeCallback?: (pair: KeyPair) => void;
  onBeforeReplace?: (old: HTMLElement, next: HTMLElement) => void;
  onAfterReplace?: (old: HTMLElement, next: HTMLElement) => void;
}

export const patchElements = (
  old: HTMLElement,
  nextEl: HTMLElement,
  options: PatchElementsOptions = {}
) => {
  if (old.innerHTML !== nextEl.innerHTML) {
    if (options.onBeforeReplace) {
      options.onBeforeReplace(old, nextEl);
    }
    old.replaceWith(nextEl);
    if (options.onAfterReplace) {
      options.onAfterReplace(old, nextEl);
    }
    return nextEl;
  } else {
    const diff = getElementsAttributesDiff(old, nextEl);
    diff.forEach(([key, value]) => {
      if (options.attributeCallback) {
        options.attributeCallback([key, value]);
      }
      setElementAttribute(old, key, value);
    });

    return old;
  }
};


export const setElementChild = (parent: LNodeNativeElement, child: LNodeNativeElement, index: number) => {
  if (index < 0) return;
  if (parent.contains(child)) return;
  if (parent.childNodes.length <= 0) {
    parent.appendChild(child);
    return;
  }

  const childNodes = Array.from(parent.childNodes);

  if (index < childNodes.length-1) {
    const after = childNodes[index+1];
    parent.insertBefore(child, after);
    return;
  }

  const before = childNodes[index-1];
  parent.insertBefore(child, before); 
}
