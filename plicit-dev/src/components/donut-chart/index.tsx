import { Component, computedSignal, LNodeRef, signal, useElementBounds, useElementHover, watchSignal } from "plicit";
import { IDonutChartProps } from "./types";
import { clamp, getAABBSize, sum, VEC2, VEC3, VEC31, Vector } from "tsmathutil";
import { useTooltip } from "../tooltip/hooks/useTooltip";
import { Tooltip } from "../tooltip";

type Shape = {
  label: string;
  value: number;
  fill: string;
  hoverFill: string;
  ref: LNodeRef;
  path?: {
    d: string;
    coords: [[number, number], [number, number]];
  };
  circle?: {
    cx: number;
    cy: number;
    r: number;
  };
};

export const DonutChart: Component<IDonutChartProps> = (props) => {
  const dataSlices = computedSignal(() => props.data);
  const texts = computedSignal(() =>
    dataSlices.get().map((it) => it.label || ""),
  );
  const textLengths = computedSignal(() => texts.get().map((t) => t.length));
  const maxTextLength = computedSignal(() => Math.max(...textLengths.get()));
  const svgRef: LNodeRef = signal(undefined);
  const maskRef: LNodeRef = signal(undefined);
  const hoverMask = useElementHover(maskRef, { svg: true });

  

  const svgBound = useElementBounds(svgRef, { debounce: 30 });
  const svgCenter = computedSignal(() => {
    const bound = svgBound.bounds.get();
    const pos = VEC2(bound.min.x, bound.min.y);
    const size = getAABBSize(bound);
    return pos.add(size.scale(0.5));
  });


  
  
  const fontSize = computedSignal(
    () =>
      clamp(
        Math.ceil(
          ((1.0 / Math.max(maxTextLength.get(), 1)) * (props.size / 2)) /
            Math.max(0.03, window.devicePixelRatio),
        ),
        14,
        22,
      ) * 0.5,
  );
  const padding = computedSignal(
    () =>
      props.padding ??
      (props.showLabelsOnSlices ? clamp(fontSize.get() * 2, 16, 32) : 16),
  );
  const inset = computedSignal(() => padding.get() / 2);
  const EPS = 0.00001;
  const thickness = 0.25;
  const radius = computedSignal(() => (props.size - 2 * padding.get()) / 2);
  const total = computedSignal(() =>
    sum(dataSlices.get().map((it) => it.value)),
  );
  const offsets = computedSignal(
    () =>
      dataSlices.get().reduce(
        (prev, cur) => {
          const v = prev.offset + cur.value;
          const next: [number, number] = [prev.offset, v];
          return { ...prev, offset: v, items: [...prev.items, next] };
        },
        { offset: 0, items: [] } as {
          offset: number;
          items: Array<[number, number]>;
        },
      ).items,
  );
  const getCoordinatesForPercent = (percent: number): [number, number] => {
    const x = Math.cos(2 * Math.PI * percent) * radius.get();
    const y = Math.sin(2 * Math.PI * percent) * radius.get();
    return [x, y];
  };
  const coordinates = computedSignal(
    (): Array<[[number, number], [number, number]]> => {
      return offsets
        .get()
        .map((o) => [
          getCoordinatesForPercent(o[0] / total.get()),
          getCoordinatesForPercent(o[1] / total.get()),
        ]);
    },
  );

  const firstSeg = computedSignal(() => dataSlices.get()[0]);
  const isFullTAU = computedSignal(
    () => firstSeg.get() && firstSeg.get().value >= total.get() - EPS,
  );

  const shapes = computedSignal(
    (): Array<Shape> =>
      isFullTAU.get()
        ? [
            {
              label: firstSeg.get().label,
              fill: firstSeg.get().color,
              hoverFill: firstSeg.get().color,
              value: firstSeg.get().value,
              ref: signal(undefined),
              circle: {
                cx: radius.get() + padding.get(),
                cy: radius.get() + padding.get(),
                r: radius.get(),
              },
            },
          ]
        : dataSlices.get().map((seg, index) => {
            const rad = radius.get();
            const coords = coordinates.get()[index];
            const [[startX, startY], [endX, endY]] = coords;
            const largeArcFlag = seg.value / total.get() > 0.5 ? 1 : 0;
            const elRef: LNodeRef = signal(undefined);
            return {
              path: {
                d: `M ${rad + padding.get()} ${rad + padding.get()}
          L ${rad + startX + padding.get()} ${rad + startY + padding.get()}
          A ${rad} ${rad} 0 ${largeArcFlag} 1 ${rad + endX + padding.get()} ${rad + endY + padding.get()}
          Z`,
                coords,
              },
              ref: elRef,
              fill: seg.color,
              hoverFill: seg.color,
              value: seg.value,
              label: seg.label,
            };
          }),
  );

  const activeShapeIndex = signal<number>(0);

  const tooltip = useTooltip({
    triggerRef: svgRef,
    body: () => {
      return computedSignal(() => {
        const shape = shapes.get()[activeShapeIndex.get()];
        return <div class="p-4 text-white" style={{
          background: shape.fill
        }}>
          <div class="grid grid-cols-[max-content,max-content] gap-2">
            <span>
              { shape.label }
            </span>
            <span>
              { shape.value.toFixed(3) }
            </span>
          </div>
        </div>;
      });
    },
    centerX: true,
    centerY: true,
    targetPosition: svgCenter
  })

  return (
    <div class="w-full h-full relative select-none">
      <svg
        width={`max(100%, ${props.size}px)`}
        height={"100%"}
        viewBox={`${-inset.get()} ${-inset.get()} ${props.size + 2 * inset.get()} ${props.size + 2 * inset.get()}`}
        ref={svgRef}
      >
        <defs>
          <mask id="mymask">
            <circle
              cx={radius.get() + padding.get()}
              cy={radius.get() + padding.get()}
              r={radius.get()}
              fill="white"
            />
            <circle
              cx={radius.get() + padding.get()}
              cy={radius.get() + padding.get()}
              r={radius.get() * Math.max(0.0, 1.0 - thickness)}
              ref={maskRef}
              fill="black"
            />
          </mask>

          {props.showLabelsOnSlices && (
            <symbol id="labels">
              {shapes.get().map((shape, i) => {
                const midPercent =
                  (offsets.get()[i][1] - shape.value / 2) / total.get();
                const [labelX, labelY] = getCoordinatesForPercent(midPercent);
                return (
                  <text
                    style={{
                      pointerEvents: 'none'
                    }}
                    key={i}
                    x={
                      radius.get() +
                      padding.get() +
                      Number(!shape.circle) * (labelX * 0.8)
                    }
                    y={
                      radius.get() +
                      padding.get() +
                      Number(!shape.circle) * (labelY * 0.8)
                    }
                    fill={"black"}
                    text-anchor={
                      shape.circle
                        ? "middle"
                        : midPercent > 0.5
                          ? "middle"
                          : midPercent > 0.1
                            ? "start"
                            : "middle"
                    }
                    font-family="Inter"
                    font-size={fontSize.get()}
                  >
                    {shape.label}
                  </text>
                );
              })}
            </symbol>
          )}
        </defs>
        <g mask="url(#mymask)">
          {shapes.get().map((shape, i) => {
            const hover = useElementHover(shape.ref);

            const isHovering = computedSignal(() => {
              const isHoveringMask = hoverMask.get();
              const isHoveringShape = hover.get();
              return !isHoveringMask && isHoveringShape;
            });

            watchSignal(isHovering, (isHover) => {
              if (isHover) {
                activeShapeIndex.set(i);
              }
            })


            const fill = computedSignal(() => {
              if (isHovering.get()) {
                return Vector.fromColor(shape.fill).scale(1.0 / 255).add(VEC3(0.2, 0.2, 0.2)).run(x => Math.min(x, 1.0)).scale(255).toRGB(4);
              }
              return shape.fill;
            })
            
            
            
            return shape.path ? (
              <path
                ref={shape.ref}
                key={i}
                d={shape.path.d}
                fill={fill}
                watch={['fill']}
                class="cursor-pointer"
              ></path>
            ) : (
              <circle
                class="cursor-pointer"
                ref={shape.ref}
                key={i}
                cx={radius.get() + padding.get()}
                cy={radius.get() + padding.get()}
                r={radius.get()}
                fill={shape.fill}
              ></circle>
            );
          })}
        </g>
        {props.showLabelsOnSlices && <use href="#labels" />}
      </svg>
      <Tooltip hook={tooltip}/>
    </div>
  );
};
