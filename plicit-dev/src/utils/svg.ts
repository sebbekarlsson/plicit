import { Vector } from "tsmathutil";

export const getPositionInSVG = (svg: SVGSVGElement, pos: Vector) => {
  let point = svg.createSVGPoint();
  point.x = pos.x;
  point.y = pos.y;
  const ctm = svg.getScreenCTM();
  if (!ctm) return point;
  point = point.matrixTransform(ctm.inverse());
  return point;
};
