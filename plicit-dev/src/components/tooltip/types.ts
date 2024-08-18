import { LNodeChild, LNodeRef, Signal } from "plicit"
import { UseTooltip } from "./hooks/useTooltip";
import { Vector } from "tsmathutil";

export type ITooltipConfig = {
  body?: LNodeChild;
  text?: string;
  triggerRef: LNodeRef;
  targetPosition?: Signal<Vector>;
  centerX?: boolean;
  centerY?: boolean;
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  spacing?: number;
}

export type ITooltipProps = {
  hook: UseTooltip;
}
