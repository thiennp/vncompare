import { RouterProvider } from 'react-router-dom';
import { createClientRouter } from './routes';

function App() {
  const router = createClientRouter();

  return (
    <RouterProvider router={router} />
  );
}

export default App;
