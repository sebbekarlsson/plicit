import "./assets/css/index.css";
import { Component, ljsx, setup, signal } from "less";
import { RouterView } from "./components/router/components/router-view";
import "./router";
import { NavBar } from "./components/navbar";
import { ModalContainer } from "./components/modal/container";
import { ToastContainer } from "./components/toast/container";
import { Button } from "./components/button";

globalThis.ljsx = ljsx;

const App: Component = () => {
  const count = signal(() => 0);
  const timesTwo = signal(() => count.get()  * 2, false, true);
  
  signal(() => console.log(timesTwo.get()), true);

  //
  //signal(() => {
  //  console.log(count.get());
  //}, true);
  
  return (
    <div class="w-full h-full">
      <NavBar />
      <Button on={{
        click: () => {
          count.set((x) => x + 1);
        }
      }}>Press</Button>
      <div class="p-4 overflow-auto">
        <RouterView />
      </div>
      <ModalContainer />
      <ToastContainer />
    </div>
  );
};

setup(App, document.getElementById("app"));
