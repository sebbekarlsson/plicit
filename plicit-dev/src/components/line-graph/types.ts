import { Vector } from "tsmathutil";

export type GraphPointData = {
  index: number;
  value: number;
  interpolatedValue: number;
};

export type LineGraphAxis = {
  tickCount?: number;
  format?: (x: number) => string;
};

export type LineGraphProps = {
  xAxis?: LineGraphAxis;
  yAxis?: LineGraphAxis;
  resolution?: Vector;
  color?: string;
};
