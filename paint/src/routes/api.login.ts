import { json } from 'react-router-dom';
import { login } from '../api/login';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await login(email, password);
  return json(result);
}
