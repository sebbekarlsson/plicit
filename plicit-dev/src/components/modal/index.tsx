import { useModals } from "./hook";
import { IModal } from "./types";
import { computed, lerp, ljsx, LNodeAttributes, Ref, smoothstep } from "plicit";

export const Modal = (
  props: LNodeAttributes & { modal: Ref<IModal>; index: number },
) => {
  const modals = useModals();

  const opacity = computed(() => {
    const f = props.modal.value.animation.value.value;
    return f * 100;
  }, [props.modal.value.animation.value]);

  const scale = computed(() => {
    const i = props.modal.value.animation.value.value;
    const f = lerp(0.5, 1.0, smoothstep(0.0, 1.0, i));
    return f;
  }, [props.modal.value.animation.value]);

  return () => (
    <div
      deps={[opacity]}
      class="bg-white shadow rounded overflow-hidden"
      style={{
        pointerEvents: "all",
        zIndex: props.index + 1 + "",
        width: `clamp(100px, 90vw, 640px)`,
        height: `clamp(200px, 90vh, 480px)`,
        position: "fixed",
        left: "0px",
        top: "0px",
        right: "0px",
        bottom: "0px",
        margin: "auto",
        opacity: `${opacity.value}%`,
        scale: `${scale.value}`,
      }}
    >
      <div
        class="w-full h-[2rem] flex items-center bg-black text-white px-2"
        style={{
          justifyContent: "space-between",
        }}
      >
        <div>{props.modal.value.title}</div>
        <div
          class="cursor-pointer hover:bg-white hover:text-black"
          on={{
            click: () => {
              modals.pop();
            },
          }}
        >
          close
        </div>
      </div>
      <div class="px-2 py-2">{props.modal.value.body}</div>
    </div>
  );
};
