import { VEC2, Vector } from "tsmathutil";
import { signal } from "../reactivity";

const pos = signal<Vector>(VEC2(0, 0));

const onMouseMove = (event: MouseEvent) => {
  const x = event.x;
  const y = event.y;
  pos.set(() => VEC2(x, y));
};

let didAddEventListener: boolean = false;

export const useMousePosition = () => {
  if (!didAddEventListener) {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("drag", onMouseMove);
    didAddEventListener = true;
  }

  const destroy = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("drag", onMouseMove);
  };

  return {
    pos,
    destroy,
  };
};
