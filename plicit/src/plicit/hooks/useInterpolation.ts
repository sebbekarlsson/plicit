import { clamp, lerp } from "tsmathutil";
import { signal, Signal } from "../reactivity";

type Timer = ReturnType<typeof requestAnimationFrame>;

export type InterpolationRunArgs = {
  duration?: number;
  from?: number;
  to: number;
  callback?: (value: number) => any;
  eachFrame?: (time: number, deltaTime: number) => any;
};

export type UseInterpolationProps = {
  initial?: number;
  duration: number;
  infinite?: boolean;
  immediate?: boolean;
  eachFrame?: (time: number, deltaTime: number) => any;
};

export type UseInterpolation = {
  value: Signal<number>;
  run: (args: InterpolationRunArgs) => Promise<void>;
  stop: () => void;
};

export const useInterpolation = (
  props: UseInterpolationProps,
): UseInterpolation => {
  const value = signal<number>(props.initial ?? 0);
  let timer: Timer | null = null;

  const stopInterpolation = () => {
    if (timer === null) return;
    cancelAnimationFrame(timer);
    timer = null;
  };

  const run = (args: InterpolationRunArgs) => {
    stopInterpolation();
    const duration = Math.max(args.duration || props.duration, 0.001);
    const startValue = (args.from ?? props.initial) ?? value.get();
    const endValue = args.to;
    let timeStarted: number = -1;
    let lastTime: number = -1;

    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        if (timer === null) {
          resolve();
          return;
        }
        if (timeStarted < 0) {
          timeStarted = time;
          lastTime = time;
        }
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        const elapsed = (time - timeStarted) / 1000;
        if (!props.infinite && elapsed >= duration) {
          resolve();
          if (args.callback) {
            args.callback(endValue);
          }
          value.set(() => endValue);
          return;
        }
        const f = clamp(elapsed / duration, 0, 1);
        const nextValue = lerp(startValue, endValue, f);
        if (args.callback) {
          args.callback(nextValue);
        }
        if (args.eachFrame) {
          args.eachFrame(time, delta);
        }
        if (props.eachFrame) {
          props.eachFrame(time, delta);
        }
        value.set(() => nextValue);
        timer = requestAnimationFrame(loop);
      };
      timer = requestAnimationFrame(loop);
    });
  };

  if (props.immediate) {
    run({
      from: props.initial ?? 0,
      to: 1.0,
    })
  }

  

  return { run, stop: stopInterpolation, value };
};
