import { Vector } from "tsmathutil";

export const pathFromPoints = (points: Vector[]) => {
  return (
    points
      .map((p, i) => (i <= 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ") + " Z"
  );
};

export type Line = [Vector, Vector];

export const linesFromPoints = (points: Vector[]): Line[] => {
  const lines: Line[] = [];
  let a = points[0];
  for (let i = 1; i < points.length; i++) {
    const b = points[i];
    lines.push([a, b]);
    a = b;
  }
  return lines;
};
