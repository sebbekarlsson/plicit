import { isRef, MaybeRef } from "./ref";
import { isSignal, MaybeSignal } from "./signal";

export const pget = <T = any>(x: MaybeRef<T> | MaybeSignal<T>): T => {
  if (isRef(x)) return x.value;
  if (isSignal(x)) return x.get();
  return x;
}
