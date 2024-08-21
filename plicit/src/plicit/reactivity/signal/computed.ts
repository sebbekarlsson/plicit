import { GSignal } from "./scope";
import { signal  } from "./signal";
import { SignalFunc, SignalFuncAsync, SignalOptions, type Signal } from './types';


export const computedSignal = <T = any>(
  init: SignalFunc<T>,
  options: SignalOptions = { isComputed: true },
): Signal<T> => signal<T>(init, { ...options, isComputed: true });

type Unpromise<T = any> = Awaited<T>;

export type ComputedAsyncSignalStatus =
  | "idle"
  | "pending"
  | "error"
  | "resolved";

export const computedAsyncSignal = <T = any>(
  init: SignalFuncAsync<T>,
  options: SignalOptions = { isComputed: true },
): {
  data: Signal<Unpromise<T> | undefined>;
  status: Signal<ComputedAsyncSignalStatus>;
  update: () => Promise<void>;
} => {
  const sig = signal<Unpromise<T> | undefined>(undefined);
  const status = signal<ComputedAsyncSignalStatus>("idle");

  const update = async () => {
    status.set("pending");
    try {
      const resp = await init();
      sig.set(resp);
      status.set("resolved");
    } catch (e) {
      console.error(e);
      status.set("error");
    }
  };

  const refresh = async () => {
    if (GSignal.current && !GSignal.current.trackedEffects.includes(update)) {
      GSignal.current.trackedEffects.push(update);
    }

    GSignal.currentEffect = update;
    update();
    GSignal.currentEffect = undefined;
  };

  if (options.immediate !== false) {
    refresh().catch((e) => console.error(e));
  }

  return { data: sig, status, update: refresh };
};
