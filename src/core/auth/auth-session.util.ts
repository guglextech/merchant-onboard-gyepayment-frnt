import { AUTH_SESSION_STORAGE_KEY } from '../api/api.constants';
import { AuthSession } from '../models/auth-session.model';

export type { AuthAdmin, AuthMerchant, AuthSession } from '../models/auth-session.model';

export function readAuthSession(): AuthSession | null {
  if (typeof localStorage === 'undefined' && typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    const raw =
      localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ??
      sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function readAccessToken(): string | null {
  return readAuthSession()?.tokens?.accessToken ?? null;
}
