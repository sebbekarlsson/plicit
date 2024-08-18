import { computedSignal, CSSProperties, lerp, Signal, signal, smoothstep } from "plicit"
import { UseInterpolationSignal, useInterpolationSignal } from "../../../hooks/useInterpolationSignal";

const isOpen = signal<boolean>(true);

export type UseSideMenu = {
  isOpen: Signal<boolean>;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  animation: UseInterpolationSignal;
  style: Signal<CSSProperties>;
}

const interp = useInterpolationSignal({
  duration: 0.5,
  initial: 1
})

export const useSideMenu = (): UseSideMenu => {
  const setOpen = (open: boolean) => {
    isOpen.set(open);

    if (open) {
      interp.run({
        to: 1.0,
        from: 0.0 
      });
    } else {
      interp.run({
        to: 0.0,
        from: 1.0
      })
    }
  }

  const toggleOpen = () => {
    setOpen(!isOpen.get());
  }

  const style = computedSignal((): CSSProperties => {
    const a = interp.value.get();
    const f = smoothstep(0.0, 1.0, a);
    const w = lerp(64, 300, f); 
    
    return {
      width: w + 'px',
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px inset, rgba(0, 0, 0, 0.22) 0px 10px 10px'
    }
  });

  return { isOpen, setOpen, toggleOpen, animation: interp, style };
}
