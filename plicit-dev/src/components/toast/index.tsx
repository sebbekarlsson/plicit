import {
  clamp,
  Component,
  computed,
  lerp,
  MaybeRef,
  smoothstep,
  unref,
} from "plicit";
import { InternalToast, useToasts } from "./hook";

type ToastProps = {
  toast: MaybeRef<InternalToast>;
};

export const Toast: Component<ToastProps> = (props) => {
  const toast = computed(() => unref(props.toast), [() => props.toast]);

  const interp = computed(
    () => toast.value.animation.value.value,
    [toast.value.animation.value],
  );
  const opacity = computed(() => clamp(interp.value, 0, 1), [interp]);

  const offsetBottom = computed(() => {
    const f = smoothstep(0, 0.96, interp.value);
    return lerp(-16 * 4, 16 * 3, f);
  }, [interp]);

  const handleClose = () => {
    const toasts = useToasts();
    toasts.pop(toast.value.uid);
  };

  return () => (
    <div
      deps={[interp]}
      class="max-w-xs bg-primary-200 text-sm text-gray-800 rounded-xl shadow-lg dark:bg-neutral-900"
      role="alert"
      tabindex="-1"
      aria-labelledby="hs-toast-solid-color-dark-label"
      style={{
        position: "fixed",
        bottom: `${offsetBottom.value}px`,
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        opacity: `${opacity.value * 100}%`,
        pointerEvents: "all",
      }}
    >
      <div class="flex p-4 items-center">
        <div>{toast.value.message}</div>
        <div class="ms-auto text-gray-900">
          <button
            on={{
              click: handleClose,
            }}
            type="button"
            class="cursor-pointer min-w-[2rem] min-h-[2rem] inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-900 hover:text-white opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100"
            aria-label="Close"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
