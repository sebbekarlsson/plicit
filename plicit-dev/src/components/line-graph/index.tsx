import {
  Component,
  computedSignal,
  CSSProperties,
  LNodeRef,
  ref,
} from "plicit";
import {
  AABB,
  clamp,
  findLineIntersection2D,
  getAABBSize,
  noise2D,
  QuadTree,
  quadTreeFindLines,
  quadTreeFromLines,
  range,
  remap,
  VEC2
} from "tsmathutil";
import { useElementBounds } from "../../hooks/useElementBounds";
import { Line, linesFromPoints, pathFromPoints } from "./utils";
import { useMousePositionSignal } from "../../hooks/useMousePositionSignal";
import { twColor } from "../../utils/style";

const N = 100;

const TICK_LINE_COLOR = "rgba(0, 0, 0, 0.15)";

type LineGraphAxis = {
  tickCount?: number;
  format?: (x: number) => string;
};

type LineGraphProps = {
  xAxis?: LineGraphAxis;
  yAxis?: LineGraphAxis;
};

const props: LineGraphProps = {
  xAxis: { tickCount: 16 },
  yAxis: {
    tickCount: 16,
    format: (x) => x.toFixed(2),
  },
};

export const LineGraph: Component = () => {
  const wrapperRef: LNodeRef = ref(undefined);
  const svgBounds = useElementBounds(wrapperRef);
  const mouse = useMousePositionSignal();

  const values = computedSignal(() => {
    return range(N).map(
      (i) => noise2D(i / N, 0.003123 + i / N, 1.39123, 2, 6) * 100,
    );
  });

  const low = computedSignal(() => Math.min(...values.get()));
  const high = computedSignal(() => Math.max(...values.get()));

  const wrapperSize = computedSignal(() => {
    const bounds = svgBounds.bounds.get();
    return getAABBSize(bounds).run(Math.floor);
  });

  const graphBounds = computedSignal((): AABB => {
    const svgBox = svgBounds.bounds.get();
    const size = getAABBSize(svgBox);
    const spaceForLabelTop = 16;
    const spaceForLabelRight = 16; // TODO: calculate this based on largest value
    return {
      min: VEC2(64, spaceForLabelTop),
      max: VEC2(size.x - spaceForLabelRight, size.y - 32),
    };
  });

  const mousePos = computedSignal(() => {
    const p = mouse.pos.get();
    const bounds = svgBounds.bounds.get();
    return p.sub(bounds.min);
  });

  const numYTicks = computedSignal(() => {
    const bounds = graphBounds.get();
    const size = getAABBSize(bounds);
    return Math.floor(
      Math.max(
        1,
        Math.min(values.get().length, size.y, props.yAxis?.tickCount || 1),
      ),
    );
  });

  const yTicks = computedSignal(() => {
    const n = numYTicks.get();
    const bounds = graphBounds.get();
    return range(n).map((i) => {
      const y = remap(
        i,
        { min: 0, max: n - 1 },
        { min: bounds.min.y, max: bounds.max.y },
      );
      const x = 0;
      return VEC2(x, y).run(Math.floor);
    });
  });

  const yLabels = computedSignal(() => {
    const ticks = yTicks.get();
    const bounds = graphBounds.get();
    const format = props.yAxis?.format || ((x) => x + "");
    return ticks.map((tick) => {
      const y = tick.y;
      return format(
        remap(
          y,
          { max: bounds.min.y, min: bounds.max.y },
          { min: low.get(), max: high.get() },
        ),
      );
    });
  });

  const numXTicks = computedSignal(() => {
    const bounds = graphBounds.get();
    const size = getAABBSize(bounds);
    return Math.floor(
      Math.max(
        1,
        Math.min(values.get().length, size.x, props.xAxis?.tickCount || 1),
      ),
    );
  });

  const xTicks = computedSignal(() => {
    const n = numXTicks.get();
    const bounds = graphBounds.get();
    return range(n).map((i) => {
      const y = 0;
      const x = remap(
        i,
        { min: 0, max: n - 1 },
        { min: bounds.min.x, max: bounds.max.x },
      );
      return VEC2(x, y).run(Math.floor);
    });
  });

  const xLabels = computedSignal(() => {
    const ticks = xTicks.get();
    const bounds = graphBounds.get();
    const format = props.xAxis?.format || ((x) => Math.floor(x) + "");
    return ticks.map((tick) => {
      const x = tick.x;
      return format(
        remap(
          x,
          { min: bounds.min.x, max: bounds.max.x },
          { min: 0, max: values.get().length },
        ),
      );
    });
  });

  const points = computedSignal(() => {
    const bounds = graphBounds.get();
    const vals = values.get();
    return vals.map((value, i) => {
      const x = remap(
        i,
        { min: 0, max: vals.length - 1 },
        { min: bounds.min.x, max: bounds.max.x },
      );
      const y = remap(
        value,
        { min: low.get(), max: high.get() },
        { min: bounds.min.y, max: bounds.max.y },
      );
      return VEC2(x, y);
    });
  });

  const mouseLine = computedSignal((): Line => {
    const bounds = graphBounds.get();
    const p = mousePos.get();
    const a = VEC2(p.x, 0);
    const b = VEC2(p.x, wrapperSize.get().y);
    a.x = clamp(a.x, bounds.min.x, bounds.max.x);
    b.x = clamp(b.x, bounds.min.x, bounds.max.x);
    return [a, b];
  });

  const lines = computedSignal(() => {
    return linesFromPoints(points.get());
  });

  const quadTree = computedSignal(() => {
    return quadTreeFromLines(lines.get(), {
      itemsPerNode: 2,
      minBoundSize: 0.1,
    });
  });

  const drawQuadNode = (node: QuadTree) => {
    const box = node.bounds;

    const vertices = [
      VEC2(box.min.x, box.min.y),
      VEC2(box.max.x, box.min.y),
      VEC2(box.max.x, box.max.y),
      VEC2(box.min.x, box.max.y),
    ];

    const cmd = pathFromPoints(vertices);
    return (
      <g>
        <path d={cmd} fill="none" stroke="purple" stroke-width="2px" />
        {node.children.map((child) => {
          return drawQuadNode(child);
        })}
      </g>
    );
  };

  const mouseIntersection = computedSignal(() => {
    const tree = quadTree.get();
    const mline = mouseLine.get();
    const all = lines.get();
    const qlines = quadTreeFindLines(tree, mline);
    if (qlines.length <= 0 || all.length <= 0) {
      return VEC2(0, 0);
    }

    for (let i = 0; i < qlines.length; i++) {
      const line = qlines[i];
      const intersection = findLineIntersection2D(
        { a: mline[0], b: mline[1] },
        { a: line[0], b: line[1] },
      );
      if (!intersection) continue;
      return intersection.point;
    }

    // TODO: This is a bug, shouldn't need to do this.
    const len = Math.min(all.length, 2);
    for (let i = 0; i < len; i++) {
      const line = all[i];
      const intersection = findLineIntersection2D(
        { a: mline[0], b: mline[1] },
        { a: line[0], b: line[1] },
      );
      if (!intersection) continue;
      return intersection.point;
    }

    return VEC2(0, 0);
  });

  const pathCommands = computedSignal(() => {
    return points
      .get()
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  });

  //const elTree = computedSignal(() => {
  //  return drawQuadNode(quadTree.get());
  //})

  //const elLines = computedSignal(() => {
  //  return <g>
  //    {lines.get().map(([a, b]) => {
  //      const cmd = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  //      return <path d={cmd} fill="none" stroke="green" stroke-width="4px"/>
  //    })}
  //  </g>;
  //})

  const elRect = computedSignal(() => {
    const box = graphBounds.get();

    const vertices = [
      VEC2(box.min.x, box.min.y),
      VEC2(box.max.x, box.min.y),
      VEC2(box.max.x, box.max.y),
      VEC2(box.min.x, box.max.y),
    ];

    const cmd = pathFromPoints(vertices);
    return (
      <path
        d={cmd}
        fill="none"
        stroke={twColor("amaranth-500")}
        stroke-width="2px"
      />
    );
  });

  return (
    <div
      class="w-full h-full select-none"
      style={{ minHeight: "480px" }}
      ref={wrapperRef}
    >
      <svg
        style={computedSignal((): CSSProperties => {
          const size = wrapperSize.get();
          return {
            width: "100%",
            height: size.y + "px",
          };
        })}
      >
        <defs>
          <linearGradient id="xTickGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="25%" stop-color={TICK_LINE_COLOR} stop-opacity="0%" />
            <stop offset="100%" stop-color={TICK_LINE_COLOR} />
          </linearGradient>
        </defs>
        {computedSignal(() => {
          const size = wrapperSize.get();
          const labels = yLabels.get();
          return (
            <g>
              {yTicks.get().map((tick, i) => {
                const start = tick;
                const label = labels[i];
                const end = VEC2(size.x, tick.y);
                const cmd = [start, end]
                  .map((it) => `${it.x},${it.y}`)
                  .join(" ");
                return (
                  <g>
                    <polyline
                      points={cmd}
                      stroke={TICK_LINE_COLOR}
                      stroke-width="1px"
                      fill="none"
                    />
                    <text
                      dominant-baseline="central"
                      font-size="0.75rem"
                      x={start.x + "px"}
                      y={start.y + "px"}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {computedSignal(() => {
          const size = wrapperSize.get();
          const labels = xLabels.get();
          return (
            <g>
              {xTicks.get().map((tick, i) => {
                const start = tick;
                const label = labels[i];
                const end = VEC2(tick.x, size.y);
                const cmd = [start, end]
                  .map((it) => `${it.x},${it.y}`)
                  .join(" ");
                return (
                  <g>
                    {/*<polyline
                      points={cmd}
                      stroke={TICK_LINE_COLOR}
                      stroke-width="1px"
                      fill="none"
                    />
                       */}
                    <rect
                      x={start.x + ""}
                      y={start.y + ""}
                      width={2 + ""}
                      height={end.y - start.y + ""}
                      fill="url(#xTickGradient)"
                    />
                    <text
                      text-anchor="middle"
                      font-size="0.75rem"
                      x={start.x + "px"}
                      y={end.y + "px"}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {computedSignal(() => (
          <polyline
            points={pathCommands.get()}
            stroke={twColor("amaranth-500")}
            stroke-width="4px"
            fill="none"
          />
        ))}
        {computedSignal(() => {
          return (
            <polyline
              points={mouseLine
                .get()
                .map((p) => `${p.x},${p.y}`)
                .join(" ")}
              fill="none"
              stroke={twColor("amaranth-700")}
              stroke-width="2px"
            />
          );
        })}
        {computedSignal(() => {
          const p = mouseIntersection.get();
          return (
            <circle
              cx={p.x + "px"}
              cy={p.y + "px"}
              r={8 + ""}
              fill={twColor("amaranth-700")}
            />
          );
        })}
        {elRect}
        {/*elTree*/}
        {/*elLines*/}
      </svg>
    </div>
  );
};
