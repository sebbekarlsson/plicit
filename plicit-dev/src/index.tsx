import "./assets/css/index.css";
import { Component, ljsx, setup } from "plicit";
import { RouterView } from "./components/router/components/router-view";
import "./router";
import { NavBar } from "./components/navbar";
import { ModalContainer } from "./components/modal/container";
import { ToastContainer } from "./components/toast/container";
import { SideMenu } from "./components/side-menu";
import { ISideMenu } from "./components/side-menu/types";
import { useRouter } from "./components/router/hooks";

globalThis.ljsx = ljsx;

const router = useRouter();

const sideMenu: ISideMenu = {
  sections: [
    {
      label: 'Admin',
      items: [
        { label: 'Dashboard', path: '/', action: () => router.push('/') },
        { label: 'People', path: '/people', action: () => router.push('/people') },
        { label: 'Files', path: '/files', action: () => router.push('/files') }
      ]
    },
    {
      label: 'Settings',
      items: [
        { label: 'Account' },
        { label: 'Appearance' },
        { label: 'Security' }
      ]
    }
  ]
}


const App: Component = () => {
  return (
    <div class="w-full h-full">
      <NavBar />
      <div class="h-full w-full grid grid-cols-[300px,1fr]">
        <SideMenu menu={sideMenu}/>
        <div class="overflow-auto" style={{
          height: '100%',
          maxHeight: 'calc(100% - 3rem)'
        }}>
          <RouterView />
        </div>
      </div>
      <ModalContainer />
      <ToastContainer />
    </div>
  );
};

setup(App, document.getElementById("app"));
