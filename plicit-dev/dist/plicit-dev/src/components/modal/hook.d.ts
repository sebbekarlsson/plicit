import { Signal } from "../../../../plicit/src";
import { IModal, IModalConfig } from "./types";
export type UseModals = {
    modals: Signal<Signal<IModal>[]>;
    push: (modal: IModalConfig) => Promise<void>;
    pop: () => Promise<void>;
};
export declare const useModals: () => UseModals;
