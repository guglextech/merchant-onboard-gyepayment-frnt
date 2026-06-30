import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import {
  AUTH_LOGIN_ENDPOINT,
  AUTH_SESSION_STORAGE_KEY,
} from '../constants/auth.constants';
import {
  ApiErrorResponse,
  AuthSessionModel,
  AuthTokensModel,
  LoginCredentials,
  LoginResponseModel,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(credentials: LoginCredentials): Observable<AuthSessionModel> {
    return this.http
      .post<LoginResponseModel>(AUTH_LOGIN_ENDPOINT, {
        email: credentials.email.trim(),
        password: credentials.password,
      })
      .pipe(
        switchMap((response) => from(this.toSession(response))),
        map((session) => {
          this.persistSession(session);
          return session;
        }),
        catchError((error) =>
          throwError(() => this.normalizeError(error?.error as ApiErrorResponse))
        )
      );
  }

  logout(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }

  getSession(): AuthSessionModel | null {
    if (typeof localStorage === 'undefined') return null;

    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthSessionModel;
    } catch {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  getAccessToken(): string | null {
    return this.getSession()?.tokens.accessToken ?? null;
  }

  private async toSession(response: LoginResponseModel): Promise<AuthSessionModel> {
    const tokens = await this.withTokenHashes(response.tokens);
    return {
      merchant: response.merchant,
      tokens,
      loggedInAt: new Date().toISOString(),
    };
  }

  private persistSession(session: AuthSessionModel): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  private async withTokenHashes(tokens: AuthTokensModel): Promise<AuthTokensModel> {
    const [accessTokenHash, refreshTokenHash] = await Promise.all([
      this.hashToken(tokens.accessToken),
      this.hashToken(tokens.refreshToken),
    ]);

    return { ...tokens, accessTokenHash, refreshTokenHash };
  }

  private async hashToken(token: string): Promise<string> {
    if (!token) return '';
    try {
      const encoded = new TextEncoder().encode(token);
      const digest = await crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return '';
    }
  }

  private normalizeError(error?: ApiErrorResponse): string {
    if (!error?.message) {
      return 'Unable to sign in. Please try again.';
    }

    if (Array.isArray(error.message)) {
      return error.message.join('. ');
    }

    return error.message;
  }
}
