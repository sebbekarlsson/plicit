import { clamp, lerp, signal, Signal } from "plicit";

type Timer = ReturnType<typeof requestAnimationFrame>;

export type InterpolationSignalRunArgs = {
  duration?: number;
  from?: number;
  to: number;
};

export type UseInterpolationSignalProps = {
  initial?: number;
  duration: number;
};

export type UseInterpolationSignal = {
  value: Signal<number>;
  run: (args: InterpolationSignalRunArgs) => Promise<void>;
  stop: () => void;
};

export const useInterpolationSignal = (
  props: UseInterpolationSignalProps,
): UseInterpolationSignal => {
  const value = signal<number>(props.initial ?? 0);
  let timer: Timer | null = null;

  const run = (args: InterpolationSignalRunArgs) => {
    const duration = Math.max(args.duration || props.duration, 0.001);
    const startValue = (args.from ?? props.initial) ?? value.get();
    const endValue = args.to;
    let timeStarted: number = -1;

    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        if (timeStarted < 0) timeStarted = time;
        const elapsed = (time - timeStarted) / 1000;
        if (elapsed >= duration) {
          resolve();
          value.set(() => endValue);
          return;
        }
        const f = clamp(elapsed / duration, 0, 1);
        value.set(() => lerp(startValue, endValue, f));
        timer = requestAnimationFrame(loop);
      };
      timer = requestAnimationFrame(loop);
    });
  };

  const stop = () => {
    if (timer === null) return;
    cancelAnimationFrame(timer);
    timer = null;
  };

  return { run, stop, value };
};
