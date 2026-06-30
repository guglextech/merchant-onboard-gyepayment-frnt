import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { ApiErrorResponse } from '../api/api.types';
import { PaginatedResponse, PaginationMeta } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import { DashboardApiResponse } from '../models/financial.model';
import {
  CreateMerchantPayload,
  MerchantDetailResponse,
  MerchantRecord,
  MerchantsQuery,
} from '../models/merchants.model';

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

  getMerchants(query: MerchantsQuery): Observable<PaginatedResponse<MerchantRecord>> {
    return this.http
      .get<PaginatedResponse<MerchantRecord>>(API_PATHS.merchants.root, {
        params: this.buildMerchantsParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        map((response) => ({
          data: response.data ?? [],
          meta: this.normalizeMeta(response.meta, query),
        })),
        catchError(() => of(this.emptyPage<MerchantRecord>(query)))
      );
  }

  getMerchant(id: string): Observable<MerchantRecord | null> {
    return this.http
      .get<MerchantDetailResponse>(`${API_PATHS.merchants.root}/${id}`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        map((response) => response.merchant ?? null),
        catchError(() => of(null))
      );
  }

  registerMerchant(payload: CreateMerchantPayload): Observable<MerchantRecord> {
    return this.http
      .post<MerchantRecord>(API_PATHS.merchants.register, payload, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError((error) =>
          throwError(() => this.normalizeError(error?.error as ApiErrorResponse))
        )
      );
  }

  private normalizeError(error?: ApiErrorResponse): string {
    if (!error?.message) {
      return 'Failed to create merchant. Please try again.';
    }

    if (Array.isArray(error.message)) {
      return error.message.join('. ');
    }

    return error.message;
  }

  private buildMerchantsParams(query: MerchantsQuery): HttpParams {
    let params = this.buildPaginationParams(query);

    if (query.status && query.status !== 'all') {
      params = params.set('status', query.status);
    }

    if (query.city?.trim()) {
      params = params.set('city', query.city.trim());
    }

    if (query.from) {
      params = params.set('from', query.from);
    }

    if (query.to) {
      params = params.set('to', query.to);
    }

    return params;
  }

  private normalizeMeta(
    meta: Partial<PaginationMeta> & Pick<PaginationMeta, 'total' | 'page' | 'limit' | 'pages'>,
    query: MerchantsQuery
  ): PaginationMeta {
    const page = meta.page ?? query.page ?? 1;
    const pages = meta.pages ?? 0;

    return {
      total: meta.total ?? 0,
      page,
      limit: meta.limit ?? query.limit ?? 20,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }
}
