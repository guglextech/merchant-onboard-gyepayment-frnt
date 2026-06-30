import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { BaseApiService } from '../http/base-api.service';
import { KybProfile, KybSubmissionPayload } from '../models/kyb.model';

@Injectable({ providedIn: 'root' })
export class KybService extends BaseApiService {
  getProfile(): Observable<KybProfile | null> {
    return this.http
      .get<KybProfile>(`${API_PATHS.kyb.root}/profile`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  submitProfile(payload: KybSubmissionPayload): Observable<KybProfile> {
    return this.http.post<KybProfile>(`${API_PATHS.kyb.root}/profile`, payload, {
      headers: this.authHeaders(),
    });
  }

  updateProfile(
    id: string,
    payload: Partial<KybSubmissionPayload>
  ): Observable<KybProfile> {
    return this.http.patch<KybProfile>(`${API_PATHS.kyb.root}/profile/${id}`, payload, {
      headers: this.authHeaders(),
    });
  }
}
