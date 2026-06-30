import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { ApiErrorResponse } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import {
  KybDecisionPayload,
  KybDecisionResponse,
  KybProfile,
  KybSubmissionPayload,
  PendingKybApplication,
} from '../models/kyb.model';

@Injectable({ providedIn: 'root' })
export class KybService extends BaseApiService {
  getPendingApplications(): Observable<PendingKybApplication[]> {
    return this.http
      .get<PendingKybApplication[]>(API_PATHS.admin.kyb.pending, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of([]))
      );
  }

  submitDecision(
    merchantId: string,
    payload: KybDecisionPayload
  ): Observable<KybDecisionResponse> {
    return this.http
      .patch<KybDecisionResponse>(`${API_PATHS.admin.kyb.root}/${merchantId}`, payload, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError((error) =>
          throwError(() => this.normalizeError(error?.error as ApiErrorResponse))
        )
      );
  }

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

  private normalizeError(error?: ApiErrorResponse): string {
    if (!error?.message) {
      return 'Unable to submit KYB decision. Please try again.';
    }

    if (Array.isArray(error.message)) {
      return error.message.join('. ');
    }

    return error.message;
  }
}
