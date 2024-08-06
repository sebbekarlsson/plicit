import { computed, Ref, ref, stringGenerator } from "less"
import { ToastObject } from "./types"
import { useInterpolation, UseInterpolation } from "../../hooks/useInterpolation"

type Timer = ReturnType<typeof setTimeout>;

export type InternalToast = ToastObject & {
  animation: UseInterpolation;
  uid: string;
  timer: Timer | null;
}

export type UseToasts = {
  push: (toast: ToastObject) => void;
  pop: (uid: string) => void;
  toasts: Ref<Ref<InternalToast>[]>;
  count: Ref<number>;
}

const toasts = ref<Ref<InternalToast>[]>([]);
const stringGen = stringGenerator();

export const useToasts = (): UseToasts => {
  const push = (toast: ToastObject) => {
    const animation = useInterpolation({
      initial: 0,
      duration: 1
    })
    const obj = ref<InternalToast>({
      ...toast,
      animation: animation,
      uid: stringGen.next(24),
      timer: null
    });
    toasts.value = [...toasts.value, obj];

    queueMicrotask(() => {
      animation.run({
        to: 1.0,
        from: 0.0,
        duration: 0.25
      }).then(() => {
        obj.value.timer = setTimeout(() => {
          if (obj.value.timer === null) return;
          pop(obj.value.uid);
        }, 2500);
      })
    })
  }

  const pop = (uid: string) => {
    if (!uid) return;
    const items = toasts.value;
    if (items.length <= 0) return;
    const toast = items.find(it => it.value.uid === uid);
    if (!toast) return;

    if (toast.value.timer !== null) {
      clearTimeout(toast.value.timer);
    }

    toast.value.animation.run({
      from: 1.0,
      to: 0.0,
      duration: 0.25
    }).then(() => {
      toasts.value = toasts.value.filter(it => it.value.uid !== uid);
    })
  }

  const count = computed(() => toasts.value.length, [toasts]);

  return {
    push,
    pop,
    toasts,
    count
  }
}
