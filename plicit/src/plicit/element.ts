import { ElementWithAttributes } from "./types";

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

export const getElementsDiff = (a: ElementWithAttributes, b: ElementWithAttributes) => {
  return getElementsAttributesDiff(a, b);
};


export const patchElements = (
  old: HTMLElement,
  nextEl: HTMLElement,
  attributeCallback?: (pair: KeyPair) => void,
) => {
  if (old.innerHTML !== nextEl.innerHTML) {
    old.replaceWith(nextEl);
    return nextEl;
  } else {
    const diff = getElementsAttributesDiff(old, nextEl);
    diff.forEach(([key, value]) => {
      if (attributeCallback) {
        attributeCallback([key, value]);
      }
      old.setAttribute(key, value);
      (old as any)[key] = value;
    });

    return old;
  }
};
