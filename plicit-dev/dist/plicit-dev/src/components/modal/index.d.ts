import { IModal } from "./types";
import { LNodeAttributes, Signal } from "plicit";
export declare const Modal: (props: LNodeAttributes & {
    modal: Signal<IModal>;
    index: number;
}) => () => any;
