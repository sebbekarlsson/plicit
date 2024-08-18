import { computedSignal } from "plicit";
import { createRouter, useRoute } from "./components/router/hooks";
import { FilesRoute } from "./routes/files";
import { HomeRoute } from "./routes/home";
import { PeopleRoute } from "./routes/people";

export const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeRoute 
    },
    {
      path: '/files',
      name: 'Files',
      component: FilesRoute
    },
    {
      path: '/people',
      name: 'People',
      component: PeopleRoute
    },
    {
      path: '/components',
      name: 'Components',
      component: (props) => {

        const route = useRoute();
        
        return () => <div class="w-full h-full">
          { computedSignal(() => <div class="p-4"><h1 class="text-lg font-semibold">{route.match?.value?.route?.name || 'EE'}</h1></div>) } 
          {props.children}
        </div>;
      },
      children: [
        {
          path: 'button',
          name: 'Button',
          component: async () => (await import('./routes/components/button')).default
        },
        {
          path: 'input-field',
          name: 'Input Field',
          component: async () => (await import('./routes/components/input-field')).default
        },
        {
          path: 'linegraph',
          name: 'Linegraph',
          component: async () => (await import('./routes/components/linegraph')).default
        },
        {
          path: 'range-slider',
          name: 'Range Slider',
          component: async () => (await import('./routes/components/range-slider')).default
        },
        {
          path: 'context-menu',
          name: 'Context Menu',
          component: async () => (await import('./routes/components/context-menu')).default
        },
        {
          path: 'tooltip',
          name: 'Tooltip',
          component: async () => (await import('./routes/components/tooltip')).default
        }
      ]
    }
  ]
});
