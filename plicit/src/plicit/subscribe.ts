import { EffectSubscriber, isRef } from "./proxy";
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
        d._deps.forEach((child) => subscribe(child, sub, depth + 1));
      }
    }
  }

  subscribe(dep, sub, 0);

  return unsubs;
};
