import {
  Component,
  computedSignal,
  isSignal,
  pget,
  signal,
  Signal,
  watchSignal,
} from "plicit";
import { Icon } from "../icon";

export const CodeBlock: Component<{
  value: string | Signal<string>;
  title: string;
}> = (props) => {
  //const value = CS(() => {
  //  if (isSignal(props.value)) {
  //    return props.value.get();
  //  }
  //  return props.value;
  //})

  return () => (
    <div class="w-full">
      <div class="w-full h-[3rem] bg-gray-200 flex items-center px-4 rounded-t rounded-t-lg">
        <div class="text-sm font-semibold">{props.title}</div>
        <div class="flex items-center flex-1 justify-end">
          <Icon
            class="text-gray-300"
            icon={{
              src: async () => import("../../assets/icons/close-circle.svg"),
              size: "1.7rem",
              fill: "currentColor",
            }}
          />
        </div>
      </div>
      {() => (
        <pre class="bg-gray-800 text-primary-100 min-h-[1rem] max-h-[640px] w-full py-4 px-4 max-w-[100%] overflow-auto">
          {computedSignal(() => pget(props.value))}
        </pre>
      )}
    </div>
  );
};
