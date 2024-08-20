import { isHTMLElement, LNodeRef, signal, watchSignal } from "plicit";
import { useSVGPointCheck } from "./useSVGPointCheck";
import { useMousePositionSignal } from "./useMousePositionSignal";

export type UseElementHoverOptions = {
  svg?: boolean;
};

export const useElementHover = (
  elRef: LNodeRef,
  options: UseElementHoverOptions = {},
) => {
  const hover = signal<boolean>(false);

  if (options.svg) {
    const mouse = useMousePositionSignal();
    const svgHover = useSVGPointCheck(elRef, mouse.pos);
    watchSignal(
      svgHover,
      (val) => {
        hover.set(val);
      },
      { immediate: true },
    );
  } else {
    const onMouseEnter = () => {
      hover.set(true);
    };

    const onMouseLeave = () => {
      hover.set(false);
    };
    watchSignal(elRef, (node) => {
      const el = node.el;
      if (!el) return;
      if (!isHTMLElement(el)) return;
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });
  }

  return hover;
};
