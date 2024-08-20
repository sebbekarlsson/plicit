import { signal, Signal, useInterpolation } from "../../../../plicit/src"
import { IModal, IModalConfig } from "./types"

export type UseModals = {
  modals: Signal<Signal<IModal>[]>;
  push: (modal: IModalConfig) => Promise<void>;
  pop: () => Promise<void>;
}

const modals = signal<Signal<IModal>[]>([]);

export const useModals = (): UseModals => {
  const push = async (modalCfg: IModalConfig) => {
    const animation = useInterpolation({
      initial: 0,
      duration: 0.25
    });
    const modal: Signal<IModal> = signal<IModal>({
      ...modalCfg,
      animation: animation 
    });

    modals.set((modals) => [...modals, modal]);
    return await animation.run({
      from: 0,
      to: 1
    })
  }

  const pop = async () => {
    const items = modals.get();
    if (items.length <= 0) return;
    const last = items[items.length-1];
    if (!last) return;
    const lastModal = last.get();
    await lastModal.animation.run({
      from: 1,
      to: 0
    });

    modals.set((modals) => modals.slice(0, modals.length-1))
  }

  return {
    modals,
    push,
    pop
  }
}
