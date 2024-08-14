import { Component } from "plicit";
import { Icon } from "../icon";

export const CodeBlock: Component<{ value: string; title: string }> = (props) => {
  return <div class="w-full">
    <div class="w-full h-[3rem] bg-gray-200 flex items-center px-2 rounded-t rounded-t-lg">
      <div class="text-sm font-semibold">
        {props.title}
      </div>
      <div class="flex items-center flex-1 justify-end">
        <Icon class="text-gray-300" icon={{
          src: async () => import('../../assets/icons/close-circle.svg'),
          size: '1.7rem',
          fill: 'currentColor'
        }}/>
      </div>
    </div>
    <pre class="bg-gray-800 text-amaranth-100 min-h-[1rem] w-full py-2 px-2 max-w-[100%] overflow-auto">
      {props.value}
    </pre>
  </div>
}
