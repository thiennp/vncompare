import type { ActionFunctionArgs } from 'react-router-dom';
import { loginLoader } from './loginLoader';

export async function loginAction({ request }: ActionFunctionArgs) {
  return await loginLoader({ request });
}
