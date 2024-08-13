import { Ref, ref } from "../../../../plicit/src"
import { useInterpolation } from "../../hooks/useInterpolation";
import { IModal, IModalConfig } from "./types"

export type UseModals = {
  modals: Ref<Ref<IModal>[]>;
  push: (modal: IModalConfig) => Promise<void>;
  pop: () => Promise<void>;
}

const modals = ref<Ref<IModal>[]>([]);

export const useModals = (): UseModals => {
  const push = async (modalCfg: IModalConfig) => {
    const modal: Ref<IModal> = ref({
      ...modalCfg,
      animation: useInterpolation({
        initial: 0,
        duration: 0.25
      })
    })
    modals.value = [...modals.value, modal];
    return await modal.value.animation.run({
      from: 0,
      to: 1
    })
  }

  const pop = async () => {
    if (modals.value.length <= 0) return;
    const last = modals.value[modals.value.length-1];
    if (!last) return;
    await last.value.animation.run({
      from: 1,
      to: 0
    })
    modals.value = modals.value.slice(0, modals.value.length-1);
  }

  return {
    modals,
    push,
    pop
  }
}
