import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { BaseApiService } from '../http/base-api.service';
import { DashboardApiResponse, SettlementRecord } from '../models/financial.model';
import { PaginatedResponse, PaginationQuery } from '../api/api.types';

@Injectable({ providedIn: 'root' })
export class FinancialService extends BaseApiService {
  getOverview(): Observable<DashboardApiResponse | null> {
    return this.http
      .get<DashboardApiResponse>(API_PATHS.financial.overview, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  getSettlements(
    query: PaginationQuery
  ): Observable<PaginatedResponse<SettlementRecord>> {
    return this.http
      .get<PaginatedResponse<SettlementRecord>>(API_PATHS.financial.settlements, {
        params: this.buildPaginationParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(this.emptyPage<SettlementRecord>(query)))
      );
  }
}
