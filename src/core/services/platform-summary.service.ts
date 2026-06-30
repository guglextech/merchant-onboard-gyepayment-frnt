import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { BaseApiService } from '../http/base-api.service';
import { PlatformSummaryResponse } from '../models/platform-summary.model';

@Injectable({ providedIn: 'root' })
export class PlatformSummaryService extends BaseApiService {
  getSummary(): Observable<PlatformSummaryResponse | null> {
    return this.http
      .get<PlatformSummaryResponse>(API_PATHS.admin.summary, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }
}
