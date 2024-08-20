import { computedSignal, isComment, isSVGSVGElement, isText, LNodeRef, Signal } from "plicit";
import { Vector } from "tsmathutil";
import { getPositionInSVG } from "../utils/svg";


const findSVGParent = (el: Element): SVGSVGElement | null => {
  if (isSVGSVGElement(el)) return el;
  if (!el.parentElement) return null;
  return findSVGParent(el.parentElement);
}

export const useSVGPointCheck = (elRef: LNodeRef, pointToCheck: Signal<Vector>, callback?: (value: boolean) => void) => {
  const update = (value: boolean) => {
    if (callback) {
      callback(value);
    }
    return value;
  }
  
  return computedSignal(() => {
    const node = elRef.get();
    const p = pointToCheck.get();
    if (!node) return update(false);
    const el = node.el;
    if (!el) return update(false);
    if (isText(el) || isComment(el)) return update(false);
    const svg = findSVGParent(el);
    if (!svg) return update(false);
    const point = getPositionInSVG(svg, p);
    if (typeof (el as any).isPointInFill !== 'function') return update(false);
    return update((el as any).isPointInFill(point) as boolean);
  });
};
