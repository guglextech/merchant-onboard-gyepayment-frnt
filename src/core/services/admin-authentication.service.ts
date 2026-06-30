import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import {
  API_PATHS,
  AUTH_SESSION_STORAGE_KEY,
} from '../api/api.constants';
import { ApiErrorResponse } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import {
  ChangePasswordPayload,
  AuthSessionModel,
  AuthTokensModel,
  LoginCredentials,
  LoginResponseModel,
  MessageResponse,
} from '../models/admin-authentication.model';

@Injectable({ providedIn: 'root' })
export class AdminAuthenticationService extends BaseApiService {
  login(credentials: LoginCredentials): Observable<AuthSessionModel> {
    return this.http
      .post<LoginResponseModel>(API_PATHS.adminAuthentication.login, {
        login: credentials.login.trim(),
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

  changePassword(payload: ChangePasswordPayload): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      API_PATHS.adminAuthentication.password,
      payload,
      { headers: this.authHeaders() }
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
    return Boolean(this.getAccessToken());
  }

  getAccessToken(): string | null {
    return this.getSession()?.tokens.accessToken ?? null;
  }

  private async toSession(response: LoginResponseModel): Promise<AuthSessionModel> {
    const tokens = await this.withTokenHashes({
      accessToken: response.accessToken,
    });

    return {
      admin: response.admin,
      tokens,
      loggedInAt: new Date().toISOString(),
    };
  }

  private persistSession(session: AuthSessionModel): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  private async withTokenHashes(tokens: AuthTokensModel): Promise<AuthTokensModel> {
    const accessTokenHash = await this.hashToken(tokens.accessToken);
    const refreshTokenHash = tokens.refreshToken
      ? await this.hashToken(tokens.refreshToken)
      : undefined;

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
