import { AABB, VEC2 } from "tsmathutil";
import { LNodeRef } from "../lnode";
import { isHTMLElement } from "../types";
import { signal, watchSignal } from "../reactivity";
import { debounce } from "../utils";
import { onMounted, onUnmounted } from "../scope";

type Timer = ReturnType<typeof setInterval>;

export type UseElementBoundsOptions = {
  debounce?: number;
  interval?: number;
  updateOnScroll?: boolean;
};

export const useElementBounds = (
  elRef: LNodeRef,
  options: UseElementBoundsOptions = {},
) => {
  const calcAABB = (el: HTMLElement): AABB => {
    const box = el.getBoundingClientRect();
    const pos = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: pos,
      max: pos.add(size),
    };
  };

  const getElement = (): HTMLElement | null => {
    const node = elRef.get();
    if (!node) return null;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return null;
    return el;
  };

  const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
  const bounds = signal<AABB>(empty);

  const refresh = () => {
    requestAnimationFrame(() => {
      const el = getElement();
      if (!el) return;
      const nextBounds = calcAABB(el);
      bounds.set(nextBounds);
    });
  };

  const update = options.debounce
    ? debounce(refresh, options.debounce)
    : refresh;

  let lastEl: HTMLElement | null = null;

  const obs = new ResizeObserver(() => {
    refresh();
  });

  watchSignal(elRef, (node) => {
    if (!node) return;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return;

    if (el !== lastEl) {
      obs.disconnect();
      obs.observe(el);

      if (lastEl) {
        lastEl.removeEventListener("mousedown", update);
        lastEl.removeEventListener("mouseenter", update);
      }

      el.addEventListener("mousedown", update);
      el.addEventListener("mouseenter", update);

      lastEl = el;
      update();
    }
  });

  window.addEventListener("resize", update);

  if (options.updateOnScroll !== false) {
    //window.addEventListener("wheel", update);
    window.addEventListener("scrollend", update, true);
  }

  let interval: Timer | null = null;

  if (options.interval) {
    onMounted(() => {
      interval = options.interval
        ? setInterval(() => {
            update();
          }, options.interval)
        : null;
    });
  }

  const destroy = () => {
    clearInterval(interval);
    interval = null;
    window.removeEventListener("resize", update);
    if (options.updateOnScroll !== false) {
      //window.removeEventListener("wheel", update);
      window.removeEventListener("scrollend", update, true);
    }
  };

  onUnmounted(() => {
    destroy();
  });

  return { bounds, update, destroy };
};
