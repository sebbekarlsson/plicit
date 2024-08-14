import { ref, signal } from "plicit"
import { VEC2, Vector } from "tsmathutil"

export const useMousePositionSignal = () => {
  const pos = signal<Vector>(() => VEC2(0, 0));

  const onMouseMove = (event: MouseEvent) => {
    const x = event.x;
    const y = event.y;
    pos.set(() => VEC2(x, y));
  }
  
  window.addEventListener('mousemove', onMouseMove);

  const destroy = () => {
    window.removeEventListener('mousemove', onMouseMove);
  }

  return {
    pos,
    destroy
  }
}
