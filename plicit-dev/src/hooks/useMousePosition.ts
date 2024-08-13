import { ref } from "plicit"
import { VEC2, Vector } from "tsmath"

export const useMousePosition = () => {
  const pos = ref<Vector>(VEC2(0, 0));

  const onMouseMove = (event: MouseEvent) => {
    const x = event.x;
    const y = event.y;
    pos.value = VEC2(x, y);
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
