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
        {
          label: 'Dashboard', path: '/', action: () => router.push('/'),
          icon: {
            src: async () => import('./assets/icons/dashboard.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        },
        {
          label: 'People', path: '/people', action: () => router.push('/people'),
          icon: {
            src: async () => import('./assets/icons/people.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        },
        {
          label: 'Files', path: '/files', action: () => router.push('/files'),
          icon: {
            src: async () => import('./assets/icons/files.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        }
      ]
    },
    {
      label: 'Settings',
      items: [
        {
          label: 'Account',
          icon: {
            src: async () => import('./assets/icons/account.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        },
        {
          label: 'Appearance',
          icon: {
            src: async () => import('./assets/icons/brush.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        },
        {
          label: 'Security',
          icon: {
            src: async () => import('./assets/icons/security.svg'),
            fill: 'currentColor',
            size: '1rem'
          }
        }
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
        <div class="overflow-auto pb-8" style={{
          height: 'auto',
          maxHeight: 'calc(100% - 3rem)'
        }}>
          <div>
            <RouterView />
          </div>
        </div>
      </div>
      {() => <ModalContainer />}
      <ToastContainer />
    </div>
  );
};

setup(App, document.getElementById("app"));
