import { Component } from "plicit";
import { PageContent } from "../../../layouts/page-content";
import { LineGraph } from "../../../components/line-graph";

const view: Component = () => {
  return <PageContent>
    <LineGraph/>
  </PageContent>;
};

export default view;
