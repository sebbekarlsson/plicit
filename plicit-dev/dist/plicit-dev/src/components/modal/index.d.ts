import { IModal } from "./types";
import { LNodeAttributes, Ref } from "plicit";
export declare const Modal: (props: LNodeAttributes & {
    modal: Ref<IModal>;
    index: number;
}) => () => any;
