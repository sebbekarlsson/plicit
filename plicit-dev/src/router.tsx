import { computedSignal, smartJoin } from "plicit";
import { createRouter, useRoute } from "./components/router/hooks";
import { HomeRoute } from "./routes/home";
import { PeopleRoute } from "./routes/people";
import { ISideMenu, ISideMenuItem } from "./components/side-menu/types";
import { IconPrimitive } from "./components/icon/types";
import { IRoute } from "./components/router/types";

const COMPONENT_ICON: IconPrimitive = {
  src: async () => import("./assets/icons/component.svg"),
  fill: "currentColor",
  size: "1rem",
};

export const router = createRouter({
  routes: [
    {
      path: "/",
      name: "index",
      component: (_props) => {
        return (props) => <div class="w-full h-full">{props.children || _props?.children}</div>;
      },
      children: [
        {
          path: "/",
          name: "Dashboard",
          component: HomeRoute,
          icon: {
            src: async () => import("./assets/icons/dashboard.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
        {
          path: "people",
          name: "People",
          component: PeopleRoute,
          icon: {
            src: async () => import("./assets/icons/people.svg"),
            fill: "currentColor",
            size: "1rem",
          },
        },
      ],
    },
    {
      path: "/components",
      name: "Components",
      icon: COMPONENT_ICON,
      component: (_props) => {
        const route = useRoute();
        return (props) => (
          <div class="w-full h-full p-4">
            {() =>
              computedSignal(() => (
                  <h1 class="text-lg font-semibold h-[3rem]">
                    {route.match?.get()?.route?.name || "EE"}
                  </h1>
              ))
            }
            {props?.children}
          </div>
        );
      },
      children: [
        {
          path: "button",
          name: "Button",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/button")).default,
        },
        {
          path: "input-field",
          name: "Input Field",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/input-field")).default,
        },
        {
          path: "linegraph",
          name: "Linegraph",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/linegraph")).default,
        },
        {
          path: "range-slider",
          name: "Range Slider",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/range-slider")).default,
        },
        {
          path: "context-menu",
          name: "Context Menu",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/context-menu")).default,
        },
        {
          path: "tooltip",
          name: "Tooltip",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/tooltip")).default,
        },
        {
          path: "form",
          name: "Form",
          icon: COMPONENT_ICON,
          component: async () =>
            (await import("./routes/components/form")).default,
        },
      ],
    },
    {
      path: '/examples',
      name: 'Examples',
      component: (_props) => {
        return (props) => <div class="w-full h-full">{props.children || _props?.children}</div>;
      },
      children: [
        {
          path: 'drag-drop',
          name: 'Drag & Drop',
          icon: COMPONENT_ICON,
          component:  async () =>
            (await import("./routes/examples/drag-drop")).default 
        }
      ]
    },
  ],
});

const routeToMenuItem = (route: IRoute, path: string[] = []): ISideMenuItem => {
  return {
    label: route.name,
    path: smartJoin([...path, route.path], "/"),
    icon: route.icon,
    items: (route.children || []).map((child) =>
      routeToMenuItem(child, [...path, route.path]),
    ),
  };
};

export const SIDE_MENU: ISideMenu = {
  items: router.get().routes.map((r) => {
    const route = r.get();
    return routeToMenuItem(route);
  }),
};
