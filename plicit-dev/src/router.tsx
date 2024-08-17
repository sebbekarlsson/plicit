import { createRouter } from "./components/router/hooks";
import { FilesRoute } from "./routes/files";
import { HomeRoute } from "./routes/home";
import { PeopleRoute } from "./routes/people";
import Components_LineGrahpRoute from './routes/components/linegraph';

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
      component: (props) => <div>{props.children}</div>,
      children: [
        {
          path: 'button',
          name: 'Button',
          component: () => <div>Button</div>
        },
        {
          path: 'linegraph',
          name: 'Linegraph',
          component: Components_LineGrahpRoute
        }
      ]
    }
  ]
});
