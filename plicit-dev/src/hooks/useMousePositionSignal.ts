import { signal } from "plicit"
import { VEC2, Vector } from "tsmathutil"

const pos = signal<Vector>(VEC2(0, 0));

const onMouseMove = (event: MouseEvent) => {
  const x = event.x;
  const y = event.y;
  pos.set(() => VEC2(x, y));
}

let didAddEventListener: boolean = false;

export const useMousePositionSignal = () => {


  if (!didAddEventListener) {
    window.addEventListener('mousemove', onMouseMove);
    didAddEventListener = true;
  }

  const destroy = () => {
    window.removeEventListener('mousemove', onMouseMove);
  }

  return {
    pos,
    destroy
  }
}
