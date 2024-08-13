import { Component, computedSignal, signal } from "less";
import { InputField } from "../input-field";

export const TextReverser: Component = () => {
  const inputValue = signal<string>(() => '');
  const reversedValue = computedSignal(() => Array.from(inputValue.get()).reverse().join(''));

  const inputField =  computedSignal(() => <InputField placeholder="Enter something" value={inputValue.get()} onChange={(v) => inputValue.set(() => v)}/>);
  
  const display = computedSignal(() => {
    const val = reversedValue.get();
    if (!val || val.length <= 0) return <div/>;
    return <p class="text-sm">The text in reverse is {val}</p>;
  })
  
  return () => (
    <div class="space-y-2">
      <div>
        {inputField}
      </div>
      <div>
        {display}
      </div>
    </div>
  )
}
