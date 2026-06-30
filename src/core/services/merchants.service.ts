import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { PaginatedResponse, PaginationQuery } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import { DashboardApiResponse } from '../models/financial.model';
import { MerchantRecord } from '../models/merchants.model';

@Injectable({ providedIn: 'root' })
export class MerchantsService extends BaseApiService {
  getOverview(): Observable<DashboardApiResponse | null> {
    return this.http
      .get<DashboardApiResponse>(API_PATHS.merchants.overview, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  getMerchants(
    query: PaginationQuery
  ): Observable<PaginatedResponse<MerchantRecord>> {
    return this.http
      .get<PaginatedResponse<MerchantRecord>>(API_PATHS.merchants.root, {
        params: this.buildPaginationParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(this.emptyPage<MerchantRecord>(query)))
      );
  }

  getMerchant(id: string): Observable<MerchantRecord | null> {
    return this.http
      .get<MerchantRecord>(`${API_PATHS.merchants.root}/${id}`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }
}
