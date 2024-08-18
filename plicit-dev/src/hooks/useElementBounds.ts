import {
  computedSignal,
  debounce,
  isHTMLElement,
  LNodeRef,
  signal,
  watchRef,
} from "plicit";
import { AABB, VEC2 } from "tsmathutil";

export type UseElementBoundsOptions = {
  debounce?: number;
};

export const useElementBounds = (
  elRef: LNodeRef,
  options: UseElementBoundsOptions = {},
) => {
  const counter = signal<number>(0);

  const calcAABB = (el: HTMLElement): AABB => {
    const box = el.getBoundingClientRect();
    const pos = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: pos,
      max: pos.add(size),
    };
  };

  const bounds = computedSignal<AABB>(() => {
    counter.get();
    const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
    const node = elRef.value;
    if (!node) return empty;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return empty;
    return calcAABB(el);
  });

  const refresh = () => {
    counter.set((x) => x + 1);
  };

  const update = options.debounce
    ? debounce(refresh, options.debounce)
    : refresh;

  let lastEl: HTMLElement | null = null;
  let lastObs: ResizeObserver | null = null;

  watchRef(() => {
    const node = elRef.value;
    if (!node) return;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return;

    if (el !== lastEl) {
      if (lastObs) {
        lastObs.disconnect();
      }

      if (lastEl) {
        lastEl.removeEventListener("mousedown", update);
      }

      el.addEventListener("mousedown", update);

      lastEl = el;
      update();
    }

    const obs = new ResizeObserver(() => {
      refresh();
    });
    lastObs = obs;

    obs.observe(el);
  }, [elRef]);

  window.addEventListener("resize", update);
  window.addEventListener("wheel", update);
  window.addEventListener("scroll", update);

  const destroy = () => {
    window.removeEventListener("resize", update);
    window.removeEventListener("wheel", update);
    window.removeEventListener("scroll", update);
  };

  return { bounds, update, destroy };
};
