import { computedSignal, CSSProperties, isHTMLElement, LNodeChild, LNodeRef, pget, signal, Signal, smoothstep, watchSignal } from "plicit"
import { ITooltipConfig } from "../types"
import { useElementBounds } from "../../../hooks/useElementBounds";
import { useInterpolationSignal } from "../../../hooks/useInterpolationSignal";
import { getAABBSize, VEC2 } from "tsmathutil";

export type UseTooltipProps = ITooltipConfig & {
  active?: Signal<boolean>;
};

export type UseTooltip = {
  style: Signal<CSSProperties>;
  body?: LNodeChild;
  text?: string;
  toolRef: LNodeRef;
}

export const useTooltip = (props: UseTooltipProps): UseTooltip => {
  const toolRef: LNodeRef = signal(undefined);
  const toolBounds = useElementBounds(toolRef);
  const triggerBounds = useElementBounds(props.triggerRef);
  const isActive = signal<boolean>(false);
  const mouseIsOnTrigger = signal<boolean>(false);
  const interp = useInterpolationSignal({
    duration: 0.25,
    initial: 0
  });

  const onMouseEnterTrigger = () => {
    mouseIsOnTrigger.set(true);
    triggerBounds.update();
    toolBounds.update();
  }

  const onMouseLeaveTrigger = () => {
    mouseIsOnTrigger.set(false);
  }

  const shouldBeVisible = computedSignal(() => {
    return pget(mouseIsOnTrigger) || pget(props.active) || false;
  })

  watchSignal(shouldBeVisible, (isOnTrigger) => {
    toolBounds.update();
    triggerBounds.update();
    if (isOnTrigger) {
      interp.run({
        to: 1.0,
        from: interp.value.get()
      }).then(() => {
        isActive.set(true);
      })
    } else {
      interp.run({
        to: 0.0,
        from: interp.value.get()
      }).then(() => {
        isActive.set(false);
      })
    }
  })
  
  watchSignal(props.triggerRef, (trigger) => {
    const el = trigger.el;
    if (!el || !isHTMLElement(el)) return;
    el.addEventListener('mouseenter', onMouseEnterTrigger);
    el.addEventListener('mouseleave', onMouseLeaveTrigger);
  });


  const selfSize = computedSignal(() => {
    const bound = toolBounds.bounds.get();
    return getAABBSize(bound);
  });

  const triggerSize = computedSignal(() => {
    const bound = triggerBounds.bounds.get();
    return getAABBSize(bound);
  })



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
      case 'top':  {
        py -= mySize.y * 0.5;
        py -= spacing;
      }; break;
    }

    
    return p.add(VEC2(px, py));
  })


  const style = computedSignal((): CSSProperties => {
    const p = pos.get();
    const x = p.x;
    const y = p.y;

    const f = interp.value.get();
    const sf = smoothstep(0.0, 1.0, f);
    const opacity = sf * 100;
    
    return {
      left: x + 'px',
      top: y + 'px',
      position: 'fixed',
      opacity: `${opacity}%`,
      zIndex: '9999',
      pointerEvents: 'none'
    }
  });

  return {
    style,
    body: props.body,
    text: props.text,
    toolRef
  }
}
