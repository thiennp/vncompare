// Client-side API for browser compatibility
// This will be handled by the server-side route action

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

// This function is not used - the actual authentication happens in the server-side route action
export async function login(): Promise<LoginResponse> {
  // This should not be called directly - use the server-side route instead
  throw new Error('Use server-side route for authentication');
}
