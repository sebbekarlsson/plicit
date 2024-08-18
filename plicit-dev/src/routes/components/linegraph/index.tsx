import { Component } from "plicit";
import { PageContent } from "../../../layouts/page-content";
import { LineGraph } from "../../../components/line-graph";

const view: Component = () => {
  return (
    <PageContent>
      <div class="w-[640px] h-[480px]">
        <LineGraph
          xAxis={{ tickCount: 16 }}
          yAxis={{ tickCount: 16, format: (x) => x.toFixed(2) }}
        />
      </div>
    </PageContent>
  );
};

export default view;
