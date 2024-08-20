type LoopFun = (time: number, delta: number) => any;

type Timer = ReturnType<typeof requestAnimationFrame>;

export type UseAnimationLoop = {
  start: () => void;
  pause: () => void;
  kill: () => void;
};

export const useAnimationLoop = (fun: LoopFun): UseAnimationLoop => {
  let timer: Timer | null = null;
  let paused: boolean = false;
  let lastTime: number = -1;

  const loop = (time: number) => {
    if (paused) return;
    if (lastTime < 0) {
      lastTime = time;
    }
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    fun(time, delta);
    timer = requestAnimationFrame(loop);
  };

  const start = () => {
    if (timer !== null && paused !== true) {
      return;
    }

    if (paused) {
      paused = false;
      loop(lastTime);
      return;
    }

    timer = requestAnimationFrame(loop);
  };

  const pause = () => {
    paused = true;
  };

  const kill = () => {
    lastTime = -1;
    paused = false;
    if (timer !== null) {
      cancelAnimationFrame(timer);
      timer = null;
    }
  };

  return { start, pause, kill };
};
