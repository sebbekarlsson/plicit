import { CSSProperties, LNodeChild, LNodeRef, Signal } from "plicit";
import { ITooltipConfig } from "../types";
export type UseTooltipProps = ITooltipConfig & {
    active?: Signal<boolean>;
};
export type UseTooltip = {
    style: Signal<CSSProperties>;
    body?: LNodeChild;
    text?: string;
    toolRef: LNodeRef;
};
export declare const useTooltip: (props: UseTooltipProps) => UseTooltip;
