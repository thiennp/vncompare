import { RouterProvider } from 'react-router-dom';
import { createSSRRouter } from './routes';

interface AppProps {
  url?: string;
}

function App({ url }: AppProps) {
  // Use current URL for client-side, or provided URL for server-side
  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const router = createSSRRouter(currentUrl);

  return <RouterProvider router={router} />;
}

export default App;
