import { isRef, Ref, ref } from "./proxy";
import { deepSubscribe } from "./subscribe";
import { ReactiveDep, unwrapReactiveDep } from "./types";

type ComputedFun<T = any> = () => T;
type ComputedAsyncFun<T = any> = () => Promise<T>;

export const computed = <T = any>(
  fun: ComputedFun<T>,
  deps: ReactiveDep[] = [],
): Ref<T> => {
  const r = ref<T>(fun());
  r._deps = deps;

  deps.forEach((dep) => {
    deepSubscribe(dep, {
      onSet: () => {
        r.value = fun();
      }
    })
  });

  return r;
};

type ComputedAsyncStatus = "idle" | "pending" | "error" | "resolved";

export const computedAsync = <T = any>(
  fun: ComputedAsyncFun<T>,
  deps: ReactiveDep[] = [],
): {
  data: Ref<T | null>;
  status: Ref<ComputedAsyncStatus>;
  refresh: () => Promise<void>;
} => {
  const r = ref<T | null>(null);
  const status = ref<ComputedAsyncStatus>("idle");
  r._deps = deps;

  const refresh = async () => {
    status.value = "pending";
    try {
      r.value = await fun();
      status.value = "resolved";
    } catch (e) {
      console.error(e);
      status.value = "error";
    }
  };

  deps.forEach((dep) => {
    const d = unwrapReactiveDep(dep);
    if (isRef(d)) {
      d.subscribe({
        onSet: () => {
          refresh().catch((e) => console.error(e));
        },
        onGet: () => {},
      });
    }
  });

  queueMicrotask(async () => {
    await refresh();
  });

  return { data: r, status: status, refresh };
};
