import {
  onUnmounted,
  signal,
  Signal,
  useAnimationLoop,
  watchSignal,
} from "plicit";
import { clamp, Vector } from "tsmathutil";

export type UseSmoothPointOptions = {
  speed?: number;
};

export const useSmoothPoint = (
  targetPoint: Signal<Vector>,
  options: UseSmoothPointOptions = {},
) => {
  const initial = targetPoint.get();
  const previous = signal<Vector>(initial);
  const output = signal<Vector>(initial);
  const speed = options.speed ?? 8;

  watchSignal(targetPoint, (point) => {
    previous.set(point);
  });

  const animation = useAnimationLoop((_time, delta) => {
    const next = targetPoint.get();
    const prev = output.get();
    const out = prev.lerp(next, clamp(delta * speed, 0.0, 1.0));
    previous.set(out);
    output.set(out);
  });
  animation.start();

  onUnmounted(() => {
    animation.kill();
  });

  return { animation, point: output };
};
