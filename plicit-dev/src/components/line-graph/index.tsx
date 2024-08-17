import {
  Component,
  computedSignal,
  CSSProperties,
  LNodeRef,
  ref,
} from "plicit";
import { getAABBSize, noise2D, range, remap, VEC2 } from "tsmathutil";
import { useElementBounds } from "../../hooks/useElementBounds";
import { useInterpolationSignal } from "../../hooks/useInterpolationSignal";

const N = 300;

export const LineGraph: Component = () => {
  const wrapperRef: LNodeRef = ref(undefined);
  const svgBounds = useElementBounds(wrapperRef);

  const interp = useInterpolationSignal({
    duration: 4.0,
    initial: 0.0
  });

  setTimeout(() => {
    interp.run({ to: 1.0, from: 0.0 }).then(() => {
      interp.run({ to: 0.0, from: 1.0 })
    });
  }, 100);
  
  const values = computedSignal(() => {
    return range(N).map((i) =>
      noise2D((i + N*interp.value.get()) / N, 0.003123 + (i / N), 33.39123, 2, 6),
    )
  });

  const low = computedSignal(() => Math.min(...values.get()))
  const high = computedSignal(() => Math.max(...values.get()));

  const wrapperSize = computedSignal(() => {
    const bounds = svgBounds.bounds.get();
    return getAABBSize(bounds).run(Math.floor);
  });

  const wantYTicks = 16;
  const numYTicks = computedSignal(() => {
    const size = wrapperSize.get();
    return Math.floor(Math.max(1, Math.min(values.get().length, size.y, wantYTicks)));
  });

  const yTicks = computedSignal(() => {
    const n = numYTicks.get();
    const size = wrapperSize.get();
    return range(n).map((i) => {
      const y = remap(i, { min: 0, max: n - 1 }, { min: 0, max: size.y });
      const x = 0;
      return VEC2(x, y).run(Math.floor);
    });
  });

  const points = computedSignal(() => {
    const size = wrapperSize.get();
    const vals = values.get();
    return vals.map((value, i) => {
      const x = remap(
        i,
        { min: 0, max: vals.length - 1 },
        { min: 0, max: size.x },
      );
      const y = remap(value, { min: low.get(), max: high.get() }, { min: 0, max: size.y });
      return VEC2(x, y);
    });
  });

  const pathCommands = computedSignal(() => {
    return points
      .get()
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  });

  console.log(pathCommands);

  return (
    <div class="w-full h-full" style={{ minHeight: "480px" }} ref={wrapperRef}>
      <svg
        style={computedSignal(
          (): CSSProperties => {
            const size = wrapperSize.get();
            return ({
              width: '100%',
              height: size.y + "px"
            });
          },
        )}
      >
        {computedSignal(() => {
          const size = wrapperSize.get();
          return (
            <g>
              {yTicks.get().map((tick) => {
                const start = tick;
                const end = VEC2(size.x, tick.y);
                const cmd = [start, end].map(it => `${it.x},${it.y}`).join(' ');
                return (
                  <polyline points={cmd} stroke="rgba(0, 0, 0, 0.25)" stroke-width="1px" fill="none" />
                );
              })}
            </g>
          );
        })}
        {computedSignal(() => (
          <polyline
            points={pathCommands.get()}
            stroke="red"
            stroke-width="4px"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
};
