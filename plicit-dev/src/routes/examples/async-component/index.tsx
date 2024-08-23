import { AsyncComponent, asyncSignal, sleep } from "plicit";

const AsyncTest: AsyncComponent = async (props) => {
  await sleep(1000);
  return <div {...props}>Hello! You've finished waiting.</div>;
};

export default () => {
  return (
    <div class="w-full h-full p-4">
      <AsyncTest />

      {asyncSignal(async () => {
        await sleep(2000);
        return <div>HELLO</div>
      }, { isComputed: true, fallback: <div>...</div> })}
    </div>
  );
};
