import {
  Component,
  computed,
  effect,
  isHTMLElement,
  LNodeRef,
  MaybeRef,
  ref,
} from "plicit";
import { AABB, clamp, getAABBSize, remap, VEC2, Vector } from "tsmathutil";
import { useMousePosition } from "../../hooks/useMousePosition";

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
  const mouse = useMousePosition();
  const dragging = ref<boolean>(false);
  const knobPosition = ref<Vector>(VEC2(0, 0));
  const clickPos = ref<Vector>(VEC2(0, 0));

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
    const pos = knobPosition.value;
    const v = remap(pos.x, trackRange.value, { min: 0, max: 100 });
    return v;
  };

  effect(() => {
    const mousePos = mouse.pos.value;
    const localPos = mousePos.sub(wrapperBounds.value.min).sub(clickPos.value);
    if (dragging.value) {
      const x = clamp(localPos.x, 0, trackRange.value.max);
      knobPosition.value = VEC2(x, 0);
      handleChange(getComputedValue());
    }
  }, [mouse.pos, dragging, wrapperBounds]);

  window.addEventListener("mouseup", () => {
    dragging.value = false;
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

  const Knob = () => {
    return () => (
      <div
        on={{
          mousedown: (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            const el = ev.target as HTMLElement;
            const box = el.getBoundingClientRect();
            const mousePos = mouse.pos.value;
            const localPos = mousePos.sub(VEC2(box.x, box.y));
            clickPos.value = localPos;

            dragging.value = true;
          },
          mouseup: () => {
            dragging.value = false;
          },
        }}
        class="h-[1.25rem] aspect-[1/1] bg-amaranth-500 absolute rounded-full cursor-grab"
        style={{
          left: knobPosition.value.x + "px",
          top: "0px",
          bottom: "0px",
          margin: "auto",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))'
        }}
        deps={[knobPosition]}
      >
        <div class="h-[60%] aspect-[1/1] bg-white rounded-full" style={{
          pointerEvents: 'none'
        }}/>
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
      <Track />
      <Knob />
    </div>
  );
};
