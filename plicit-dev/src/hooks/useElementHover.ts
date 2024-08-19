import { isHTMLElement, LNodeRef, signal, watchSignal } from "plicit";

export const useElementHover = (elRef: LNodeRef) => {
  const hover = signal<boolean>(false);
  
  const onMouseEnter = () => {
    hover.set(true);
  }

  const onMouseLeave = () => {
    hover.set(false);
  }


  watchSignal(elRef, (node) => {
    const el = node.el;
    if (!el) return;
    if (!isHTMLElement(el)) return;
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
  })


  return hover;
}
