import "./assets/css/index.css";
import { Component, ljsx, setup } from "plicit";
import { RouterView } from "./components/router/components/router-view";
import "./router";
import { NavBar } from "./components/navbar";
import { ModalContainer } from "./components/modal/container";
import { ToastContainer } from "./components/toast/container";

globalThis.ljsx = ljsx;


const App: Component = () => {
  return (
    <div class="w-full h-full">
      <NavBar />
      <div class="p-4 overflow-auto">
        <RouterView />
      </div>
      <ModalContainer />
      <ToastContainer />
    </div>
  );
};

setup(App, document.getElementById("app"));
