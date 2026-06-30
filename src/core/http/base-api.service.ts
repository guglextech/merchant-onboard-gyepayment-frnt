import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginationMeta, PaginationQuery } from '../api/api.types';
import { readAccessToken } from '../auth/auth-session.util';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected readonly http = inject(HttpClient);

  protected authHeaders(): HttpHeaders {
    const token = readAccessToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  protected buildPaginationParams(query: PaginationQuery): HttpParams {
    let params = new HttpParams()
      .set('page', String(query.page ?? 1))
      .set('limit', String(query.limit ?? 20));

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.sortKey && query.sortDirection) {
      params = params.set('sortBy', query.sortKey).set('sortOrder', query.sortDirection);
    }

    return params;
  }

  protected emptyPage<T>(query: PaginationQuery): { data: T[]; meta: PaginationMeta } {
    return {
      data: [],
      meta: {
        total: 0,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}
