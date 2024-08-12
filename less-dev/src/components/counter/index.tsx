import { computed, LNodeRef, ref } from "less";
import { Button } from "../button";
import { useContextMenu } from "../context-menu/hooks/useContextMenu";
import { ContextMenu } from "../context-menu";

export const Counter = () => {
  const counter = ref<number>(0);
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
  
  return () => {
    return (
      <div class="flex gap-4 items-center">
        <div class="text-gray-700 text-sm">
          The counter is{" "}
          {computed(
            () => (
              <span class="text-gray-900 font-semibold">{counter.value}</span>
            ),
            [counter],
          )}
        </div>
        <Button
          ref={elRef}
          on={{
            click: () => (counter.value = counter.value + 1),
          }}
        >
          Increment
        </Button>
        {() => <ContextMenu hook={ctxMenu}/>}
      </div>
    );
  };
};
