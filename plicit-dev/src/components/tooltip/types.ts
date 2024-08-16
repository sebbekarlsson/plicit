import { LNodeChild, LNodeRef } from "plicit"
import { UseTooltip } from "./hooks/useTooltip";

export type ITooltipConfig = {
  body?: LNodeChild;
  text?: string;
  triggerRef: LNodeRef;
}

export type ITooltipProps = {
  hook: UseTooltip;
}
