import { isSignal, MaybeSignal } from "./signal";

export const pget = <T = any>(x: MaybeSignal<T>): T => {
  if (isSignal(x)) return x.get();
  return x;
}
