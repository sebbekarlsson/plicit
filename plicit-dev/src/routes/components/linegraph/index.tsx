import { Component } from "plicit";
import { LineGraph } from "../../../components/line-graph";

const view: Component = () => {
  return (
    <div>
      <div class="w-[640px] h-[480px]">
        <LineGraph
          xAxis={{ tickCount: 16 }}
          yAxis={{ tickCount: 16, format: (x) => x.toFixed(2) }}
        />
      </div>
    </div>
  );
};

export default view;
