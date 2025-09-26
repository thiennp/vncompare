import type { LoginRequest } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isString, isType } from 'guardz';

export function isLoginRequest(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is LoginRequest {
  return isType<LoginRequest>({ email: isString, password: isString })(
    value,
    config
  );
}
