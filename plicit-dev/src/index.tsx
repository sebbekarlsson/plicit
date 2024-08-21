import "./assets/css/index.css";
import { Component, computedSignal, ljsx, setup, signal } from "plicit";
import "./router";
import { NavBar } from "./components/navbar";
import { ModalContainer } from "./components/modal/container";
import { ToastContainer } from "./components/toast/container";
import { SideMenu } from "./components/side-menu";
import { useSideMenu } from "./components/side-menu/hooks/useSideMenu";
import { MainRouter } from "./components/router/components/main-router";
import { Button } from "./components/button";
import { SIDE_MENU } from "./router";

globalThis.ljsx = ljsx;




const App: Component = () => {
  const sideMenuHook = useSideMenu();

  return (
    <div class="w-full h-full flex flex-col">
      <NavBar />
      <div class="h-full w-full grid grid-cols-[max-content,1fr]">
        <SideMenu menu={SIDE_MENU} hook={sideMenuHook} />
        <div
          class="overflow-auto"
          style={{
            height: "auto",
            maxHeight: "calc(100% - 4rem)",
          }}
        >
          <div class="w-full h-full">
            <MainRouter />
          </div>
        </div>
      </div>
      <ModalContainer />
      <ToastContainer />
    </div>
  );
};


const AppDebug: Component = () => {
  const counter = signal<number>(0);
  
  return <div>
    <Button on={{ click: () => counter.set(x => x + 1) }}>Press Me</Button>
    <span>{ computedSignal(() => counter.get()) }</span>
  </div>;
}

//setup(AppDebug, document.getElementById("app"));
setup(App, document.getElementById("app"));
