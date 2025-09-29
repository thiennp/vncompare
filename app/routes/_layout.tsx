import Layout from '../features/shared/components/Layout';
import { getUserByToken } from '../features/auth/services/getUserByToken.server';
import { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  // Get authenticated user by token
  const user = await getUserByToken(request);

  return {
    user,
    isAuthenticated: !!user,
  };
}

export default function LayoutRoute() {
  return <Layout />;
}
