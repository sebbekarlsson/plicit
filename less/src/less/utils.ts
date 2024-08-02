export const lerp = (vFrom: number, vTo: number, scale: number) => {
  return vFrom + (vTo - vFrom) * scale;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const fract = (x: number) => x - Math.floor(x);

export const smoothstep = (
  edge0: number,
  edge1: number,
  value: number,
): number => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3.0 - 2.0 * x);
};
