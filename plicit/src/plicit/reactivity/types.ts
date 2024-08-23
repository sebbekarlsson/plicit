import { isFunction } from "../is";
import { MaybeSignal } from "./signal";

export type ReactiveDep<T = any> = MaybeSignal<T> | (() => T) | (() => any);
export const unwrapReactiveDep = <T = any>(
  dep: ReactiveDep<T>,
): MaybeSignal<T> => {
  if (isFunction(dep)) {
    return unwrapReactiveDep<T>(dep());
  }
  return dep;
};
