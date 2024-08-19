import { Component, isSignal, signal, Signal, watchSignal } from "plicit";
import { Icon } from "../icon";

export const CodeBlock: Component<{ value: string | Signal<string>; title: string }> = (props) => {
  const val = signal<string>(isSignal(props.value) ? props.value.get() : props.value);


  if (isSignal(props.value)) {
    const sig = props.value as Signal<string>;
    watchSignal(sig, () => {
      val.set(sig.get());
    })
  }
  
  //const value = CS(() => {
  //  if (isSignal(props.value)) {
  //    return props.value.get();
  //  }
  //  return props.value;
  //})
  
  return () => <div class="w-full">
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
    {(() => <pre class="bg-gray-800 text-primary-100 min-h-[1rem] max-h-[320px] w-full py-2 px-2 max-w-[100%] overflow-auto">
      {val.get()}
    </pre>)}
  </div>
}
