import { AsyncComponent, sleep } from "plicit";

const AsyncTest: AsyncComponent = async (props) => {
  await sleep(1000);
  return <div {...props}>Hello! You've finished waiting.</div>;
};

export default () => {
  return (
    <div class="w-full h-full p-4">
      <AsyncTest />
    </div>
  );
};
