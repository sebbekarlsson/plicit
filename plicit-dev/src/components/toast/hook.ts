import {
  computedSignal,
  signal,
  Signal,
  stringGenerator,
  useInterpolation,
  UseInterpolation,
} from "plicit";
import { ToastObject } from "./types";

type Timer = ReturnType<typeof setTimeout>;

export type InternalToast = ToastObject & {
  animation: UseInterpolation;
  uid: string;
  timer: Timer | null;
};

export type UseToasts = {
  push: (toast: ToastObject) => void;
  pop: (uid: string) => void;
  toasts: Signal<Signal<InternalToast>[]>;
  count: Signal<number>;
};

const toasts = signal<Signal<InternalToast>[]>([]);
const stringGen = stringGenerator();

export const useToasts = (): UseToasts => {
  const push = (toast: ToastObject) => {
    const animation = useInterpolation({
      initial: 0,
      duration: 1,
    });
    const obj = signal<InternalToast>({
      ...toast,
      animation: animation,
      uid: stringGen.next(24),
      timer: null,
    });

    toasts.set((old) => [...old, obj]);

    queueMicrotask(() => {
      animation
        .run({
          to: 1.0,
          from: 0.0,
          duration: 0.25,
        })
        .then(() => {
          obj.set((old) => ({
            ...old,
            timer: setTimeout(() => {
              pop(old.uid);
            }, 2500),
          }));
        });
    });
  };

  const pop = (uid: string) => {
    if (!uid) return;
    const items = toasts.get();
    if (items.length <= 0) return;
    const toastSig = items.find((it) => it.get().uid === uid);
    if (!toastSig) return;

    const toast = toastSig.get();
    const timer = toast.timer;
    if (timer !== null) {
      clearTimeout(timer);
    }

    toast.animation
      .run({
        from: 1.0,
        to: 0.0,
        duration: 0.25,
      })
      .then(() => {
        toasts.set((old) => old.filter((it) => it.get().uid !== uid));
      });
  };

  const count = computedSignal(() => toasts.get().length);

  return {
    push,
    pop,
    toasts,
    count,
  };
};
