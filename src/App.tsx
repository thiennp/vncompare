import { RouterProvider } from 'react-router-dom';
import { createClientRouter } from './routes.config';
import { Toaster } from './features/shared/components/ui/toaster';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';

function App() {
  const router = createClientRouter();
  
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
