const AUTH_SESSION_KEY = 'gye-auth-session';

export interface AuthMerchant {
  id: string;
  email: string;
  businessName: string;
  merchantCode: string;
  status: string;
}

export interface AuthSession {
  merchant?: AuthMerchant;
  tokens?: { accessToken?: string };
  loggedInAt?: string;
}

export function readAuthSession(): AuthSession | null {
  if (typeof localStorage === 'undefined' && typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    const raw =
      localStorage.getItem(AUTH_SESSION_KEY) ??
      sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function readAccessToken(): string | null {
  return readAuthSession()?.tokens?.accessToken ?? null;
}
