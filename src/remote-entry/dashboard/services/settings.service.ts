import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiKeyResponse, ChangePasswordPayload } from '../models/settings.model';
import { readAccessToken } from '../utils/auth-session.util';

const BASE_URL = 'https://gye-payment-service.onrender.com/api/v1';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${BASE_URL}/auth`;

  private authHeaders(): HttpHeaders {
    const token = readAccessToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  generateApiKey(): Observable<ApiKeyResponse> {
    return this.http.post<ApiKeyResponse>(`${this.authUrl}/api-key`, {}, {
      headers: this.authHeaders(),
    });
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ message?: string }> {
    return this.http.patch<{ message?: string }>(`${this.authUrl}/password`, payload, {
      headers: this.authHeaders(),
    });
  }
}
