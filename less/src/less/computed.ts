import { ref } from "./proxy";
import { ReactiveDep } from "./types";

export const computed = <T = any>(fun: () => T, deps: ReactiveDep[] = []) => {
  const r = ref<T>(fun());

  deps.forEach((dep) => {
    dep.subscribe({
      set: () => {
        r.value = fun();
      },
      get: () => {}
    })
  });

  return r;
}
