import { LNodeNativeElement, LNodeRef } from "../lnode";
import { signal, watchSignal } from "../reactivity";
import { isComment, isText } from "../types";

export const useElementVisibility = (elRef: LNodeRef) => {
  const visible = signal<boolean>(false);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visible.set(true);
      } else {
        visible.set(false);
      }
    });
  });

  let lastElement: LNodeNativeElement | null = null;

  watchSignal(elRef, (node) => {
    if (!node) return;
    if (!node.el) return;
    if (isText(node.el) || isComment(node.el)) return;
    if (lastElement === node.el) return;
    if (lastElement) {
      observer.disconnect();
    }
    observer.observe(node.el);
    lastElement = node.el;
  });

  return visible;
};
