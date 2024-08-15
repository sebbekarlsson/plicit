import { EffectSubscriber, isRef, isSignal, watchSignal } from ".";
import { ReactiveDep, unwrapReactiveDep } from "./types";

export const deepSubscribe = (dep: ReactiveDep, sub: EffectSubscriber, maxDepth: number = -1) => {
  const unsubs: Array<() => void> = [];
  const subscribe = (dep: ReactiveDep, sub: EffectSubscriber, depth: number = 0) => {
    const d = unwrapReactiveDep(dep);
    if (isRef(d)) {
      unsubs.push(d.subscribe({
        onSet: (...args) => {
          if (sub.onSet) {
            sub.onSet(...args);
          }
        },
        onGet: (...args) => {
          if (sub.onGet) {
            sub.onGet(...args);
          }
        },
      }));

      if (depth < maxDepth) {
        console.log(`snopp ${depth}, ${maxDepth}`)
        d._deps.forEach((child) => subscribe(child, sub, depth + 1));
      }
    } else if (isSignal(d)) {
      unsubs.push(watchSignal(d, () => {
        if (sub.onTrigger) {
          sub.onTrigger();
        }
      }));
    }
  }

  subscribe(dep, sub, 0);

  return unsubs;
};
