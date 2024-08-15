import { computedSignal, signal } from "plicit";
import { Button } from "../button";

export const Counter = () => {
  const counter = signal(() => 0);

  return () => {
    return (
      <div class="space-y-4">
        <div class="flex gap-4 items-center">
          <div>
            <div class="text-gray-700 text-sm">
              <span>The counter is </span>
              {computedSignal(() => (
                <span class="text-gray-900 font-semibold">{counter.get()}</span>
              ))}
            </div>
            <div class="text-gray-700 text-sm">
              <span>The counter times two is </span>
              {computedSignal(() => (
                <span class="text-gray-900 font-semibold">
                  {counter.get() * 2}
                </span>
              ))}
            </div>
          </div>
          <Button
            on={{
              click: () => counter.set((x) => x + 1),
            }}
          >
            Increment
          </Button>
        </div>
      </div>
    );
  };
};
