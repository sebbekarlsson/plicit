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

  const update = () => {
    const fun = () => {
      counter.set((x) => x + 1);
    };
    const updateFunc = options.debounce ? debounce(fun, options.debounce) : fun;
    updateFunc();
  };

  let lastEl: HTMLElement | null = null;
  let lastObs: ResizeObserver | null = null;

  watchRef(() => {
    const node = elRef.value;
    if (!node) return;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return;

    if (el !== lastEl && lastObs) {
      lastObs.disconnect();
      lastEl = el;
    }

    const obs = new ResizeObserver(() => {
      update();
    });

    obs.observe(el);
    lastObs = obs;
  }, [elRef]);

  const onWindowResize = () => {
    update();
  };

  const onScroll = () => {
    update();
  };

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("wheel", onScroll);

  const destroy = () => {
    window.removeEventListener("resize", onWindowResize);
    window.removeEventListener("wheel", onScroll);
  };

  return { bounds, update, destroy };
};
