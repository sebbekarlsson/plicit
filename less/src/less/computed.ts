import { Ref, ref } from "./proxy";
import { ReactiveDep, unwrapReactiveDep } from "./types";

export const computed = <T = any>(fun: () => T, deps: ReactiveDep[] = []): Ref<T> => {
  const r = ref<T>(fun());
  r._deps = deps;
  
  deps.forEach((dep) => {
    const d = unwrapReactiveDep(dep);
    d.subscribe({
      set: () => {
        r.value = fun();
      },
      get: () => {},
    });
  });

  return r;
};
