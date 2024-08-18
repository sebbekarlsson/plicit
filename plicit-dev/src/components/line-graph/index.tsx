import {
  Component,
  computedSignal,
  CSSProperties,
  LNodeRef,
  none,
  onMounted,
  onUnmounted,
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
  VEC2,
} from "tsmathutil";
import { useElementBounds } from "../../hooks/useElementBounds";
import { Line, linesFromPoints, pathFromPoints } from "./utils";
import { useMousePositionSignal } from "../../hooks/useMousePositionSignal";
import { twColor } from "../../utils/style";
import { Tooltip } from "../tooltip";
import { useTooltip } from "../tooltip/hooks/useTooltip";
import { GraphPointData, LineGraphProps } from "./types";
import { useElementHover } from "../../hooks/useElementHover";

const N = 300;
const SEED = 144.93491823;
const OCT = 5;
const FREQ = 3;

const TICK_LINE_COLOR = "rgba(0, 0, 0, 0.15)";
const PRIMARY_COLOR = twColor("primary-500");

export const LineGraph: Component<LineGraphProps> = (props) => {
  const wrapperRef: LNodeRef = ref(undefined);
  const svgBounds = useElementBounds(wrapperRef);
  const mouse = useMousePositionSignal();
  const hover = useElementHover(wrapperRef);

  onMounted(() => {
    console.log('Linegraph mounted! --->');
  })

  onUnmounted(() => {
    console.log('Linegraph unmounted! <---')
  })

  const values = computedSignal(() => {
    return range(N).map(
      (i) => noise2D(i / N, 0.003123 + i / N, SEED, OCT, FREQ) * 100,
    );
  });

  const dataCount = computedSignal(() => {
    return values.get().length;
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
        Math.min(values.get().length, size.y, props.yAxis?.tickCount || 8),
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
        Math.min(values.get().length, size.x, props.xAxis?.tickCount || 8),
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

  const intersectionGlobal = computedSignal(() => {
    const point = mouseIntersection.get();
    return point.add(svgBounds.bounds.get().min);
  });

  const intersectionData = computedSignal((): GraphPointData => {
    const count = dataCount.get();
    const bounds = graphBounds.get();
    const p = mouseIntersection.get();
    const x = p.x;
    const y = p.y;
    const index = clamp(
      count -
        (1 +
          Math.floor(
            remap(
              x,
              { min: bounds.min.x, max: bounds.max.x },
              { min: 0, max: count - 1 },
            ),
          )),
      0,
      count - 1,
    );
    const value = values.get()[index];
    const interpolatedValue = remap(
      y,
      { max: bounds.min.y, min: bounds.max.y },
      { min: low.get(), max: high.get() },
    );

    return { index, value, interpolatedValue };
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
    return (
      <path
        d={pathFromPoints([
          VEC2(box.min.x, box.min.y),
          VEC2(box.max.x, box.min.y),
          VEC2(box.max.x, box.max.y),
          VEC2(box.min.x, box.max.y),
        ])}
        fill="url(#areaGradient)"
        stroke-width="1px"
      />
    );
  });

  const tooltip = useTooltip({
    triggerRef: wrapperRef,
    targetPosition: intersectionGlobal,
    centerX: true,
    centerY: true,
    placement: "top",
    spacing: 16,
    body: () => {
      const value = computedSignal(() => {
        const data = intersectionData.get();
        const format = props.yAxis?.format || ((x) => x + "");
        return <span>{format(data.interpolatedValue)}</span>;
      });
      return (
        <div
          class={`p-4 text-white font-semibold`}
          style={{
            background: props.color || PRIMARY_COLOR,
          }}
        >
          {value}
        </div>
      );
    },
  });

  return (
    <div
      class="w-full h-full select-none"
      style={{
        ...(props.resolution
          ? {
              width: `${props.resolution.x}px`,
              height: `${props.resolution.y}px`,
            }
          : {}),
      }}
      ref={wrapperRef}
    >
      <svg
        style={computedSignal((): CSSProperties => {
          return {
            width: "100%",
            height: "100%",
          };
        })}
      >
        <defs>
          <linearGradient id="xTickGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color={TICK_LINE_COLOR} stop-opacity="0%" />
            <stop offset="50%" stop-color={TICK_LINE_COLOR} />
            <stop
              offset="100%"
              stop-color={TICK_LINE_COLOR}
              stop-opacity="0%"
            />
          </linearGradient>
          <linearGradient id="yTickGradient" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0%" stop-color={TICK_LINE_COLOR} stop-opacity="0%" />
            <stop offset="50%" stop-color={TICK_LINE_COLOR} />
            <stop
              offset="100%"
              stop-color={TICK_LINE_COLOR}
              stop-opacity="0%"
            />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="60%" stop-color={props.color || PRIMARY_COLOR} stop-opacity="0%" />
            <stop offset="100%" stop-color={props.color || PRIMARY_COLOR} stop-opacity="10%" />
          </linearGradient>
        </defs>
        {elRect}
        {computedSignal(() => {
          const size = wrapperSize.get();
          const labels = yLabels.get();
          return (
            <g>
              {yTicks.get().map((tick, i) => {
                const start = tick;
                const label = labels[i];
                const end = VEC2(size.x, tick.y);
                return (
                  <g>
                    <rect
                      x={start.x + ""}
                      y={start.y + ""}
                      width={end.x - start.x + "px"}
                      height={1 + "px"}
                      fill="url(#yTickGradient)"
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
                return (
                  <g>
                    <rect
                      x={start.x + ""}
                      y={start.y + ""}
                      width={1 + "px"}
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
            stroke={props.color || PRIMARY_COLOR}
            stroke-width="4px"
            fill="none"
          />
        ))}

        {computedSignal(() => {
          if (!hover.get()) return none();
          return (
            <g>
              {computedSignal(() => {
                return (
                  <polyline
                    points={mouseLine
                      .get()
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    fill="none"
                    stroke={props.color || PRIMARY_COLOR}
                    stroke-width="0.5px"
                  />
                );
              })}
              {computedSignal(() => {
                const p = mouseIntersection.get();
                return (
                  <circle
                    cx={p.x + "px"}
                    cy={p.y + "px"}
                    r={6 + ""}
                    fill={props.color || PRIMARY_COLOR}
                  />
                );
              })}
            </g>
          );
        })}
        {/*elTree*/}
        {/*elLines*/}
      </svg>
      <Tooltip hook={tooltip} />
    </div>
  );
};
