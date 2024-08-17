import "./assets/css/index.css";
import { Component, ljsx, setup } from "plicit";
import { RouterView } from "./components/router/components/router-view";
import "./router";
import { NavBar } from "./components/navbar";
import { ModalContainer } from "./components/modal/container";
import { ToastContainer } from "./components/toast/container";
import { SideMenu } from "./components/side-menu";
import { ISideMenu, ISideMenuItem } from "./components/side-menu/types";
import { useRouter } from "./components/router/hooks";
import { useSideMenu } from "./components/side-menu/hooks/useSideMenu";
import { MainRouter } from "./components/router/components/main-router";

globalThis.ljsx = ljsx;

const router = useRouter();

const componentRoutes: ISideMenuItem[] = [
  {
    label: "Button",
  },
  {
    label: 'Input Field'
  },
  {
    label: 'Range Slider'
  },
  {
    label: 'Context Menu'
  },
  {
    label: 'Tooltip'
  },
  {
    label: 'Line Graph',
    path: '/components/linegraph'
  }
];

const sideMenu: ISideMenu = {
  items: [
    {
      label: "Admin",
      items: [
        {
          label: "Dashboard",
          path: "/",
          icon: {
            src: async () => import("./assets/icons/dashboard.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          label: "People",
          path: "/people",
          icon: {
            src: async () => import("./assets/icons/people.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          label: "Files",
          path: "/files",
          icon: {
            src: async () => import("./assets/icons/files.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          label: "Components",
          icon: {
            src: async () => import("./assets/icons/component.svg"),
            fill: "currentColor",
            size: "1rem",
          },
          items: componentRoutes.map((it) => {
            return {
              ...it,
              label: it.label,
              icon: {
                src: async () => import("./assets/icons/cube.svg"),
                fill: "currentColor",
                size: "1rem",
              },
            };
          }),
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          label: "Account",
          icon: {
            src: async () => import("./assets/icons/account.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          label: "Appearance",
          icon: {
            src: async () => import("./assets/icons/brush.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          label: "Security",
          icon: {
            src: async () => import("./assets/icons/security.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
      ],
    },
  ],
};

const App: Component = () => {
  const sideMenuHook = useSideMenu();

  return (
    <div class="w-full h-full flex flex-col">
      <NavBar />
      <div class="h-full w-full grid grid-cols-[max-content,1fr]">
        <SideMenu menu={sideMenu} hook={sideMenuHook} />
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
      {() => <ModalContainer />}
      <ToastContainer />
    </div>
  );
};

setup(App, document.getElementById("app"));
