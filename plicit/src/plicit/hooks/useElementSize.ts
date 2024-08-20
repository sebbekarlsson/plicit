import { LNodeRef, unwrapElement } from "../lnode";
import { computedSignal, signal, watchSignal } from "../reactivity";
import { onUnmounted } from "../scope";
import { useResizeObserver } from "./useResizeObserver";

export const useElementSize = (target: LNodeRef) => {
  const isSVG = computedSignal(() => unwrapElement(target)?.namespaceURI?.includes('svg'));
  const width = signal<number>(0);
  const height = signal<number>(0);

  const { stop: stopObserver } = useResizeObserver(target, ([entry]) => {
    const boxSize = entry.contentBoxSize;
    if (window && isSVG.get()) {
      const el = unwrapElement(target);
      if (el) {
        const rect = el.getBoundingClientRect();
        width.set(rect.width);
        height.set(rect.height);
      }
    } else {
      if (boxSize) {
        const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
        width.set(formatBoxSize.reduce((acc, {inlineSize}) => acc + inlineSize, 0));
        height.set(formatBoxSize.reduce((acc, {blockSize}) => acc + blockSize, 0));
      } else {
        width.set(entry.contentRect.width);
        height.set(entry.contentRect.height);
      }
    }
  });

  const stopWatch = watchSignal(target, (node) => {
    const el = unwrapElement(node);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    width.set(rect.width);
    height.set(rect.height);
  });

  const stop = () => {
    stopWatch();
    stopObserver();
  }

  onUnmounted(() => {
    stop();
  })

  return { width, height, stop };
}
