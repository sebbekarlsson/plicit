import { MaybeSignal } from "plicit";

export type IconPrimitive = {
  src: (() => Promise<any>) | string;
  size?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  flipH?: MaybeSignal<boolean>;
};

export type IIconProps = {
  icon: IconPrimitive;
};
