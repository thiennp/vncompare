import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import routes from './routes';

const router = createBrowserRouter(routes as unknown as RouteObject[]);

// Hydrate the server-rendered HTML so client event handlers attach properly
hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <RouterProvider router={router} />
);


