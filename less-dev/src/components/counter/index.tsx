import { computed, ref } from "less";
import { Button } from "../button";

export const Counter = () => {
  const counter = ref<number>(0);
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
          on={{
            click: () => (counter.value = counter.value + 1),
          }}
        >
          Increment
        </Button>
      </div>
    );
  };
};
