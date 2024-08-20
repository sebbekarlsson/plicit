import {
  computedSignal,
  CSSProperties,
  isHTMLElement,
  LNodeChild,
  LNodeRef,
  pget,
  signal,
  Signal,
  smoothstep,
  useElementBounds,
  useElementSize,
  useInterpolation,
  watchSignal,
} from "plicit";
import { ITooltipConfig } from "../types";
import { getAABBSize, VEC2 } from "tsmathutil";
import {
  useSmoothPoint,
  UseSmoothPointOptions,
} from "../../../hooks/useSmoothPoint";

export type UseTooltipProps = ITooltipConfig & {
  active?: Signal<boolean>;
  smooth?: UseSmoothPointOptions;
};

export type UseTooltip = {
  style: Signal<CSSProperties>;
  body?: LNodeChild;
  text?: string;
  toolRef: LNodeRef;
};

export const useTooltip = (props: UseTooltipProps): UseTooltip => {
  const toolRef: LNodeRef = signal(undefined);
  const toolSize = useElementSize(toolRef);
  const triggerBounds = useElementBounds(props.triggerRef);
  const isActive = signal<boolean>(false);
  const mouseIsOnTrigger = signal<boolean>(false);
  const interp = useInterpolation({
    duration: 0.25,
    initial: 0,
  });

  const onMouseEnterTrigger = () => {
    mouseIsOnTrigger.set(true);
    triggerBounds.update();
  };

  const onMouseLeaveTrigger = () => {
    mouseIsOnTrigger.set(false);
  };

  const shouldBeVisible = computedSignal(() => {
    return pget(mouseIsOnTrigger) || pget(props.active) || false;
  });

  const selfSize = computedSignal(() => {
    return VEC2(toolSize.width.get(), toolSize.height.get());
  });

  const triggerSize = computedSignal(() => {
    const bound = triggerBounds.bounds.get();
    return getAABBSize(bound);
  });

  const targetPos = computedSignal(() => {
    const userPos = pget(props.targetPosition);
    if (userPos) return userPos;
    const b = triggerBounds.bounds.get();
    let p = b.min.clone();
    const mySize = selfSize.get();
    const trigSize = triggerSize.get();
    p.x -= mySize.x * 0.5;
    p.x += trigSize.x * 0.5;
    p.y -= 0.5 * trigSize.y;
    p.y -= mySize.y;
    return p;
  });

  const pos = computedSignal(() => {
    const mySize = selfSize.get();

    let px = 0;
    let py = 0;
    const spacing = props.spacing ?? 0;

    const p = targetPos.get();
    if (props.centerX) {
      px -= mySize.x * 0.5;
    }
    if (props.centerY) {
      py -= mySize.y * 0.5;
    }

    switch (props.placement) {
      case "top":
        {
          py -= mySize.y * 0.5;
          py -= spacing;
        }
        break;
    }

    return p.add(VEC2(px, py));
  });

  const smoothPoint = props.smooth ? useSmoothPoint(pos, props.smooth) : null;

  const style = computedSignal((): CSSProperties => {
    const p = smoothPoint ? smoothPoint.point.get() : pos.get();
    const x = p.x;
    const y = p.y;

    const f = interp.value.get();
    const sf = smoothstep(0.0, 1.0, f);
    const opacity = sf * 100;

    return {
      left: x + "px",
      top: y + "px",
      position: "fixed",
      opacity: `${opacity}%`,
      zIndex: "9999",
      pointerEvents: "none",
    };
  });

  watchSignal(shouldBeVisible, (isOnTrigger) => {
    triggerBounds.update();
    if (isOnTrigger) {
      if (smoothPoint) {
        smoothPoint.animation.start();
      }
      interp
        .run({
          to: 1.0,
          from: interp.value.get(),
        })
        .then(() => {
          isActive.set(true);
        });
    } else {
      if (smoothPoint) {
        smoothPoint.animation.pause();
      }
      interp
        .run({
          to: 0.0,
          from: interp.value.get(),
        })
        .then(() => {
          isActive.set(false);
        });
    }
  });

  watchSignal(props.triggerRef, (trigger) => {
    const el = trigger.el;
    if (!el || !isHTMLElement(el)) return;
    el.addEventListener("mouseenter", onMouseEnterTrigger);
    el.addEventListener("mouseleave", onMouseLeaveTrigger);
  });

  return {
    style,
    body: props.body,
    text: props.text,
    toolRef,
  };
};
