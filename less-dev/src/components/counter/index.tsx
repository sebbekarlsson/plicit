import { ref } from "less";
import { Button } from "../button";

export const Counter = () => {
  const counter = ref<number>(0);
  return () => {
    return (
      <div class="space-y-2">
        <div class="text-gray-700 text-sm">
          The counter is{" "}
          {() => (
            <span class="text-gray-900 font-semibold" deps={[counter]}>
              {counter.value}
            </span>
          )}
        </div>
        <Button
          on={{
            click: () => (counter.value = counter.value + 1),
          }}
        >
          Click
        </Button>
      </div>
    );
  };
};
