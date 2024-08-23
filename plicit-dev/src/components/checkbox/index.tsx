import { Component, computedSignal, none, pget } from "plicit";
import { ICheckboxProps } from "./types";
import { Icon } from "../icon";
import { pset } from "plicit/src";

export const Checkbox: Component<ICheckboxProps> = (props) => {
  return (
    <div
      on={{
        click: () => {
          pset(props.value, (x) => !Boolean(x));
        },
      }}
      class="flex items-center bg-gray-50 justify-center shadow-inner w-[2rem] h-[2rem] border border-gray-300 text-gray-500 cursor-pointer"
      style={{}}
    >
      {computedSignal(() =>
        pget(props.value) === true ? (
          <Icon
            icon={{
              src: async () => import("../../assets/icons/check.svg"),
              fill: "currentColor",
              size: "1.6rem",
            }}
          />
        ) : (
          none()
        ),
      )}
    </div>
  );
};
