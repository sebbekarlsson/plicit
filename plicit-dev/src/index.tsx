import { ljsx, Component, setup } from "plicit";

globalThis.ljsx = ljsx;

const App: Component = () => {
  return (
    <div>
      Hello world!
    </div>
  );
};

setup(App, document.getElementById("app"));
