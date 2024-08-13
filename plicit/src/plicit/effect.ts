import { isRef } from "./proxy";
import { ReactiveDep, unwrapReactiveDep } from "./types";

type EffectFun<T = any> = () => T;


export const effect = <T = any>(
  fun: EffectFun<T>,
  deps: ReactiveDep[] = [],
) => {
  deps.forEach((dep) => {
    const d = unwrapReactiveDep(dep);
    if (isRef(d)) {
      d.subscribe({
        onSet: () => {
          fun();
        },
        onGet: () => {},
      });
    }
  });
};
