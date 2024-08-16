import { computedSignal, CSSProperties, isHTMLElement, LNodeChild, LNodeRef, ref, signal, Signal, smoothstep, watchRef, watchSignal } from "plicit"
import { ITooltipConfig } from "../types"
import { useElementBounds } from "../../../hooks/useElementBounds";
import { useInterpolationSignal } from "../../../hooks/useInterpolationSignal";
import { getAABBSize } from "tsmathutil";

export type UseTooltipProps = ITooltipConfig;

export type UseTooltip = {
  style: Signal<CSSProperties>;
  body?: LNodeChild;
  text?: string;
  toolRef: LNodeRef;
}

export const useTooltip = (props: UseTooltipProps): UseTooltip => {
  const toolRef: LNodeRef = ref(undefined);
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

  watchSignal(mouseIsOnTrigger, (isOnTrigger) => {
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
  
  watchRef(() => {
    const el = props.triggerRef.value?.el;
    if (!el || !isHTMLElement(el)) return;
    el.addEventListener('mouseenter', onMouseEnterTrigger);
    el.addEventListener('mouseleave', onMouseLeaveTrigger);
  }, [props.triggerRef]);


  const getMySize = () => {
    const bound = toolBounds.bounds.get();
    return getAABBSize(bound);
  }

  const getTriggerSize = () => {
    const bound = triggerBounds.bounds.get();
    return getAABBSize(bound);
  }


  const targetPos = computedSignal(() => {
    const b = triggerBounds.bounds.get();
    const p = b.min.clone();

    const mySize = getMySize();
    const trigSize = getTriggerSize();
    p.x -= mySize.x * 0.5;
    p.x += trigSize.x * 0.5;
    p.y -= 0.5 * trigSize.y;
    p.y -= mySize.y;
    
    return p;
  });


  const style = computedSignal((): CSSProperties => {
    const p = targetPos.get();
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
