import { isHTMLElement, LNodeRef, signal, watchRef } from "plicit";

export const useElementHover = (elRef: LNodeRef) => {
  const hover = signal<boolean>(false);
  
  const onMouseEnter = () => {
    hover.set(true);
  }

  const onMouseLeave = () => {
    hover.set(false);
  }

  watchRef(() => {
    const el = elRef.value?.el;
    if (!isHTMLElement(el)) return;
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
  }, [elRef])

  return hover;
}
