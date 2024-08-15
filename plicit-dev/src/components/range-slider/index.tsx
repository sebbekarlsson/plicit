import {
  Component,
  computed,
  computedSignal,
  effectSignal,
  isHTMLElement,
  LNodeRef,
  MaybeRef,
  ref,
  signal,
  unref,
} from "plicit";
import { AABB, clamp, getAABBSize, remap, VEC2, Vector } from "tsmathutil";
import { useMousePositionSignal } from "../../hooks/useMousePositionSignal";

type RangeSliderProps = {
  value: MaybeRef<number>;
  onChange?: (value: number) => any;
};

export const RangeSlider: Component<RangeSliderProps> = (props) => {
  const handleChange = (value: number) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const wrapper: LNodeRef = ref(undefined);
  const mouse = useMousePositionSignal();
  const dragging = signal<boolean>(false);
  const knobPosition = signal<Vector>(VEC2(0, 0));
  const clickPos = signal<Vector>(VEC2(0, 0));

  const wrapperBounds = computed(() => {
    const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
    const node = wrapper.value;
    if (!node) return empty;
    const el = node.el;
    if (!el || !isHTMLElement(el)) return empty;
    const box = el.getBoundingClientRect();
    const pos = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: pos,
      max: pos.add(size),
    };
  }, [wrapper]);

  const trackRange = computed(() => {
    const bounds = wrapperBounds.value;
    const trackLength = bounds.max.x - bounds.min.x;
    const knobLength = 16;
    return { min: 0, max: trackLength - knobLength };
  }, [wrapperBounds]);

  const getComputedValue = () => {
    const pos = knobPosition.get();
    const v = remap(pos.x, trackRange.value, { min: 0, max: 100 });
    return v;
  };

  const getInverseComputedValue = (value: number) => {
    return remap(value, { min: 0, max: 100 }, trackRange.value);
  };

  queueMicrotask(() => {
    setTimeout(() => {
      knobPosition.set(VEC2(getInverseComputedValue(unref(props.value)), 0));
    }, 0);
  });

  effectSignal(() => {
    const mousePos = mouse.pos.get();
    const localPos = mousePos.sub(wrapperBounds.value.min).sub(clickPos.get());
    if (dragging.get()) {
      const x = clamp(localPos.x, 0, trackRange.value.max);
      knobPosition.set(VEC2(x, 0));
      handleChange(getComputedValue());
    }
  });

  window.addEventListener("mouseup", () => {
    dragging.set(() => false);
  });

  const Track = () => {
    return (
      <div
        class="w-full bg-gray-100 h-full absolute rounded-full shadow-inner"
        style={{
          left: "0px",
          right: "0px",
          top: "0px",
          bottom: "0px",
          margin: "auto",
        }}
      />
    );
  };

  const fraction = computedSignal(() => {
    const pos = knobPosition.get();
    return remap(pos.x, trackRange.value, { min: 0, max: 1 });
  });

  const Rail = () => {
    return computedSignal(() => {
      const f = fraction.get();
      return <div
        class="bg-amaranth-300 h-full absolute rounded-full shadow-inner"
        id="RAIL"
        style={{
          left: "0px",
          top: "0px",
          bottom: "0px",
          marginTop: "auto",
          marginBottom: "auto",
          zIndex: 2,
          width: (f * 100) + "%",
        }}
      />
    });
  };

  const Knob = () => {
    return () => (
      <div
        on={{
          mousedown: (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            const el = ev.target as HTMLElement;
            const box = el.getBoundingClientRect();
            const mousePos = mouse.pos.get();
            const localPos = mousePos.sub(VEC2(box.x, box.y));
            clickPos.set(() => localPos);

            dragging.set(() => true);
          },
          mouseup: () => {
            dragging.set(() => false);
          },
        }}
        class="h-[1.25rem] aspect-[1/1] bg-amaranth-500 absolute rounded-full cursor-grab"
        style={{
          left: knobPosition.get().x + "px",
          top: "0px",
          bottom: "0px",
          margin: "auto",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))",
        }}
        deps={[knobPosition]}
      >
        <div
          class="h-[60%] aspect-[1/1] bg-white rounded-full"
          style={{
            pointerEvents: "none",
          }}
        />
      </div>
    );
  };

  return (
    <div
      class="h-[0.65rem] relative"
      ref={wrapper}
      style={{
        zIndex: 1,
      }}
    >
      <Rail />
      <Track />
      <Knob />
    </div>
  );
};
