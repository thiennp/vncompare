import { Outlet } from 'react-router-dom';
import { Toaster } from './features/shared/components/ui/toaster';

export default function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
