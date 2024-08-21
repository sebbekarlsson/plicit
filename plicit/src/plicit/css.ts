//export type CSSProperties = {};

import { unique } from "tsmathutil";
import { ElementClass } from "./types";
import { isSignal } from "./reactivity";


export type CSSProperties = Partial<CSSStyleDeclaration>;

const kebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const cssPropsToString = (props: CSSProperties): string => {
  return Object.entries(props).map(([key, value]) => {
    return `${kebab(key)}: ${value}`;
  }).join(';')
}


export const mergeClasses = (clazz: ElementClass): string => {
  if (typeof clazz === 'string') return clazz;
  return unique(clazz).map(it => isSignal(it) ? it.get() : it).join(' ');
}
