import { createRouter } from "./components/router/hooks";
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
    }
  ]
});
