import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { PaginatedResponse, PaginationQuery } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import { CollectionRecord } from '../models/collections-oversight.model';

@Injectable({ providedIn: 'root' })
export class CollectionsOversightService extends BaseApiService {
  getCollections(
    query: PaginationQuery
  ): Observable<PaginatedResponse<CollectionRecord>> {
    return this.http
      .get<PaginatedResponse<CollectionRecord>>(API_PATHS.collectionsOversight.root, {
        params: this.buildPaginationParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(this.emptyPage<CollectionRecord>(query)))
      );
  }

  sendReminder(collectionId: string): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(
      `${API_PATHS.collectionsOversight.root}/${collectionId}/remind`,
      {},
      { headers: this.authHeaders() }
    );
  }

  resolveCollection(collectionId: string): Observable<{ message?: string }> {
    return this.http.patch<{ message?: string }>(
      `${API_PATHS.collectionsOversight.root}/${collectionId}/resolve`,
      {},
      { headers: this.authHeaders() }
    );
  }
}
