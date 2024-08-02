import "./assets/css/index.css";
import { ljsx, ref } from "less";
import { ModalContainer } from "./components/modal/container";
import { NavBar } from "./components/navbar";
import { Card } from "./components/card";
import { Button } from "./components/button";

const Counter = () => {
  const counter = ref<number>(0);
  return () => {
    return (
      <div class="space-y-2">
        <div class="text-gray-700 text-sm">
          The counter is{" "}
          {() => <span class="text-gray-900 font-semibold" deps={[counter]}>{counter.value}</span>}
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

const App = (
  <div class="w-full h-full">
    <NavBar />
    <div class="p-4">
      <Card title="Counter">
        <Counter/>
      </Card>
    </div>
    <ModalContainer />
  </div>
);

App.mountTo(document.getElementById("app"));
