export type IconPrimitive = {
  src: (() => Promise<any>) | string;
  size?: string;
  color?: string;
  fill?: string;
  stroke?: string;
}


export type IIconProps = {
  icon: IconPrimitive;
}
