import { isHTMLElement } from "tsmathutil";
import { LNodeRef } from "../lnode";
import { signal, watchSignal } from "../reactivity";
import { useMousePosition } from "./useMousePosition";
import { useSVGPointCheck } from "./useSVGPointCheck";

export type UseElementHoverOptions = {
  svg?: boolean;
};

export const useElementHover = (
  elRef: LNodeRef,
  options: UseElementHoverOptions = {},
) => {
  const hover = signal<boolean>(false);

  if (options.svg) {
    const mouse = useMousePosition();
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
