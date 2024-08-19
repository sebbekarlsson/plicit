import {
  Component,
  computed,
  computedSignal,
  effectSignal,
  LNodeRef,
  MaybeSignal,
  pget,
  signal,
} from "plicit";
import { clamp, remap, VEC2, Vector } from "tsmathutil";
import { useMousePositionSignal } from "../../hooks/useMousePositionSignal";
import { useElementBounds } from "../../hooks/useElementBounds";
import { useTooltip } from "../tooltip/hooks/useTooltip";
import { Tooltip } from "../tooltip";

type RangeSliderProps = {
  value: MaybeSignal<number>;
  onChange?: (value: number) => any;
};

const KNOB_SIZE = 20;

export const RangeSlider: Component<RangeSliderProps> = (props) => {
  const handleChange = (value: number) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const knobRef: LNodeRef = signal(undefined);
  const wrapper: LNodeRef = signal(undefined);
  const mouse = useMousePositionSignal();
  const dragging = signal<boolean>(false);
  const knobPosition = signal<Vector>(VEC2(0, 0));
  const clickPos = signal<Vector>(VEC2(0, 0));

  const wrapperBounds = useElementBounds(wrapper);

  const trackRange = computed(() => {
    const bounds = wrapperBounds.bounds.get();
    const trackLength = bounds.max.x - bounds.min.x;
    return { min: 0, max: trackLength - KNOB_SIZE };
  }, [wrapperBounds.bounds]);

  const getComputedValue = () => {
    const pos = knobPosition.get();
    const v = remap(pos.x, trackRange.value, { min: 0, max: 100 });
    return v;
  };

  const outputValue = computedSignal(() => getComputedValue());

  const getInverseComputedValue = (value: number) => {
    return remap(value, { min: 0, max: 100 }, trackRange.value);
  };

  queueMicrotask(() => {
    setTimeout(() => {
      knobPosition.set(VEC2(getInverseComputedValue(pget(props.value)), 0));
    }, 0);
  });

  effectSignal(() => {
    const mousePos = mouse.pos.get();
    const localPos = mousePos.sub(wrapperBounds.bounds.get().min).sub(clickPos.get());
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
    wrapperBounds.bounds.get()
    return remap(pos.x, trackRange.value, { min: 0, max: 1 });
  });

  const Rail = () => {
    return computedSignal(() => {
      const f = fraction.get();
      return <div
        class="bg-primary-300 h-full absolute rounded-full shadow-inner"
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
        ref={knobRef}
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
        class="aspect-[1/1] bg-primary-500 absolute rounded-full cursor-grab"
        style={{
          height: KNOB_SIZE + 'px',
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

  const tooltipHook = useTooltip({
    triggerRef: knobRef,
    active: dragging,
    text: 'Hello!',
    body: () => {
      return <div class="w-full">
        <div class="h-[2rem] w-full bg-primary-500 text-white flex items-center px-4 text-sm font-medium">Slider</div>
        <div class="p-4 w-full">
          { computedSignal(() => <div class="font-semibold">{outputValue.get().toFixed(1)}</div>) }
        </div>
      </div>;
    } 
  })

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
      <Tooltip hook={tooltipHook}/>
    </div>
  );
};
