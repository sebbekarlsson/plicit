import { clamp, lerp, Ref, ref } from "less"

type Timer = ReturnType<typeof requestAnimationFrame>;

export type InterpolationRunArgs = {
    duration?: number;
    from?: number;
    to: number;
  };

export type UseInterpolationProps = {
  initial?: number;
  duration: number;
}

export type UseInterpolation = {
  value: Ref<number>;
  run: (args: InterpolationRunArgs) => Promise<void>;
  stop: () => void;
}

export const useInterpolation = (props: UseInterpolationProps): UseInterpolation => {
  const value = ref<number>(props.initial ?? 0);
  let timer: Timer | null = null;


  const run = (args: InterpolationRunArgs) => {
    const duration = Math.max(args.duration || props.duration, 0.001);
    const startValue = (args.from || props.initial) ?? value.value;
    const endValue = args.to;
    let timeStarted: number = -1;

    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        if (timeStarted < 0) timeStarted = time;
        const elapsed = (time - timeStarted) / 1000;
        if (elapsed >= duration) {
          resolve();
          return;
        };
        const f = clamp(elapsed / duration, 0, 1);
        value.value = lerp(startValue, endValue, f);
        timer = requestAnimationFrame(loop);
      }
      timer = requestAnimationFrame(loop);
    })
  }

  const stop = () => {
    if (timer === null) return;
    cancelAnimationFrame(timer);
    timer = null;
  }

  return { run, stop, value }
}
