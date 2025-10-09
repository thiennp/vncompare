// Client-side API that calls server-side MongoDB authentication
import { login as serverLogin } from './login.server';

export interface LoginSuccessResponse {
  readonly success: true;
  readonly user: {
    email: string;
    name: string;
    role: string;
  };
  readonly token: string;
}

export interface LoginErrorResponse {
  readonly success: false;
  readonly error: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  // Call the server-side MongoDB authentication
  return await serverLogin(email, password);
}
