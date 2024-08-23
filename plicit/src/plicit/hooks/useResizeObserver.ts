import { isHTMLElement } from "../types";
import { LNodeRef } from "../lnode";
import { watchSignal } from "../reactivity";
import { onUnmounted } from "../scope";

export const useResizeObserver = (
  target: LNodeRef,
  callback?: ResizeObserverCallback,
) => {
  let lastEl: HTMLElement | null = null;

  let obs: ResizeObserver | null = new ResizeObserver((entries, observer) => {
    if (callback) {
      callback(entries, observer);
    }
  });

  const stopWatch = watchSignal(target, (node) => {
    if (!obs) return;
    if (!node) return;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return;

    if (el !== lastEl) {
      if (lastEl) {
        obs.unobserve(lastEl);
      }
      obs.observe(el);
    }
  });

  const cleanup = () => {
    if (obs) {
      obs.disconnect();
      obs = null;
    }
  };

  const stop = () => {
    cleanup();
    stopWatch();
  };

  onUnmounted(() => {
    stop();
  });

  return { stop };
};
