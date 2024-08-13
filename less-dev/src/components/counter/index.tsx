import { computed, computedSignal, LNodeRef, ref, signal } from "less";
import { Button } from "../button";
import { useContextMenu } from "../context-menu/hooks/useContextMenu";
import { ContextMenu } from "../context-menu";

export const Counter = () => {
  const counter = signal(() => 0);

  const counterMul2 = computedSignal(() => counter.get()*2);
  //const counter = ref<number>(0);
  const elRef: LNodeRef = ref(undefined);

  const ctxMenu = useContextMenu({
    triggerRef: elRef,
    menu: {
      sections: [
        {
          items: [
            { label: 'Item 1' },
            { label: 'Item 2' },
            { label: 'Item 3' },
            { label: 'Item 4' }
          ]
        }
      ]
    }
  });

  const counterDisplay = computedSignal(() => <span class="text-gray-900 font-semibold">{counter.get()}</span>);
  const counterDisplayMul2 = computedSignal(() => <span class="text-gray-900 font-semibold">{counterMul2.get()}</span>);
  
  return () => {
    return (
      <div class="flex gap-4 items-center">
        <div class="text-gray-700 text-sm">
          <span>The counter is </span>
          {counterDisplay}
        </div>
        <div class="text-gray-700 text-sm">
          <span>The counter times two is </span>
          {counterDisplayMul2}
        </div>
        <Button
          ref={elRef}
          on={{
            click: () => counter.set(x => x+1),
          }}
        >
          Increment
        </Button>
        {() => <ContextMenu hook={ctxMenu}/>}
      </div>
    );
  };
};
