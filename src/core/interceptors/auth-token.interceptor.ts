import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

const AUTH_SESSION_STORAGE_KEY = 'gye-auth-session';
export const AUTH_REQUIRED = new HttpContextToken<boolean>(() => false);

interface SessionShape {
  tokens?: {
    accessToken?: string;
  };
}

function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;

  const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as SessionShape;
    return session.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

function shouldAttachToken(url: string): boolean {
  if (url.startsWith('/data/') || url.includes('/data/')) {
    return false;
  }

  return url.startsWith('/api/') || url.startsWith('http://') || url.startsWith('https://');
}

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAccessToken();
  const explicitlyAuth = req.context.get(AUTH_REQUIRED);

  if (!token || (!explicitlyAuth && !shouldAttachToken(req.url))) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(authReq);
};

