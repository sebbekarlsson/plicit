import { computedSignal, debounce, isHTMLElement, LNodeRef, signal, watchRef } from "plicit";
import { AABB, VEC2 } from "tsmathutil";

export const useElementBounds = (elRef: LNodeRef) => {


  const counter = signal<number>(0);
  
  //const observe = computedSignal(() => {
  //  const node = elRef.value;
  //  if (!node) return null;
  //  const el = node.el;
  //  if (!el) return null;
  // 
  //})


  const calcAABB = (el: HTMLElement): AABB => {
    const box = el.getBoundingClientRect();
    const pos = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: pos,
      max: pos.add(size),
    };
  }
  
  const bounds = computedSignal<AABB>(() => {
    counter.get();
    const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
    const node = elRef.value;
    if (!node) return empty;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return empty;
    return calcAABB(el);
  });

  const update = () => {
    counter.set((x) => x+1);
    bounds.trigger();
  }

  watchRef(() => {
    const node = elRef.value;
    if (!node) return;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return;

    const obs = new ResizeObserver(() => {
      update();
    });

    obs.observe(el);
  }, [elRef]);

  const onWindowResize = () => {
    update();
  }

  const onScroll = () => {
    update();
  }

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('wheel', onScroll);

  const destroy = () => {
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('wheel', onScroll);
  }

  return { bounds, update, destroy };
}
