import { computedSignal, isHTMLElement, LNodeRef } from "plicit";
import { AABB, VEC2 } from "tsmathutil";

export const useElementBounds = (elRef: LNodeRef) => {
  const bounds = computedSignal<AABB>(() => {
    const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
    const node = elRef.value;
    if (!node) return empty;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return empty;
    const box = el.getBoundingClientRect();
    const pos = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: pos,
      max: pos.add(size),
    };
  });

  const update = () => {
    bounds.trigger();
  }

  const onWindowResize = () => {
    update();
  }

  window.addEventListener('resize', onWindowResize);

  const destroy = () => {
    window.removeEventListener('resize', onWindowResize);
  }

  return { bounds, update, destroy };
}
