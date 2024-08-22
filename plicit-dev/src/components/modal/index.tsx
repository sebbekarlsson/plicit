import { useModals } from "./hook";
import { IModal } from "./types";
import {
  computedSignal,
  lerp,
  LNodeAttributes,
  Signal,
  smoothstep,
} from "plicit";

export const Modal = (
  props: LNodeAttributes & { modal: Signal<IModal>; index: number },
) => {
  const modals = useModals();

  const opacity = computedSignal(() => {
    const f = props.modal.get().animation.value.get();
    return f * 100;
  });

  const scale = computedSignal(() => {
    const i = props.modal.get().animation.value.get();
    const f = lerp(0.5, 1.0, smoothstep(0.0, 1.0, i));
    return f;
  });

  return () => (
    <div
      class="fixed inset-0 z-10 w-screen overflow-y-auto"
      style={computedSignal(() => ({
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
        opacity: `${opacity.get()}%`,
        scale: `${scale.get()}`,
      }))}
    >
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div class="text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  {props.modal.get().title}
                </h3>
                <div class="text-sm text-gray-500">
                  {props.modal.get().body}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex justify-end sm:px-6 gap-3">
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              on={{
                click: () => {
                  modals.pop();
                },
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto"
              on={{
                click: () => {
                  modals.pop();
                },
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
