import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { CollectionRecord } from '../models/collection-record.model';
import { CreateCustomerPayload, CustomerHistoryResponse, CustomerProfile, CustomerRecord, CustomersResponse } from '../models/customer-record.model';
import { DashboardApiResponse } from '../models/dashboard-overview.model';
import { PlanSetupPayload } from '../models/plan-setup-payload.model';
import { PlansResponse } from '../models/plan-record.model';
import { SettlementRecord } from '../models/settlement-record.model';

const BASE_URL = 'https://gye-payment-service.onrender.com/api/v1';
const AUTH_SESSION_KEY = 'gye-auth-session';

function readAccessToken(): string | null {
  if (typeof localStorage === 'undefined' && typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    // Try localStorage first (post-migration), fall back to sessionStorage (pre-migration).
    const raw =
      localStorage.getItem(AUTH_SESSION_KEY) ??
      sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { tokens?: { accessToken?: string } };
    return session.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly http = inject(HttpClient);
  private readonly customersUrl = `${BASE_URL}/customers`;
  private readonly plansUrl = `${BASE_URL}/plans`;

  private authHeaders(): HttpHeaders {
    const token = readAccessToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getOverview(): Observable<DashboardApiResponse | null> {
    return this.http
      .get<DashboardApiResponse>(`${BASE_URL}/dashboard/overview`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }


  createPlanSetup(payload: PlanSetupPayload): Observable<PlanSetupPayload> {
    return this.http.post<PlanSetupPayload>(this.plansUrl, payload, {
      headers: this.authHeaders(),
    });
  }

  getPlans(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
  }): Observable<PlansResponse> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 1))
      .set('limit', String(query.limit ?? 20));

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.sortKey && query.sortDirection) {
      params = params.set('sortBy', query.sortKey).set('sortOrder', query.sortDirection);
    }

    return this.http
      .get<PlansResponse>(this.plansUrl, {
        params,
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() =>
          of({
            data: [],
            meta: {
              total: 0,
              page: query.page ?? 1,
              limit: query.limit ?? 20,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          })
        )
      );
  }

  /** GET /customers/:id — plain customer record with activeMandateId */
  getCustomerProfile(id: string): Observable<CustomerProfile | null> {
    return this.http
      .get<CustomerProfile>(`${this.customersUrl}/${id}`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  /** GET /customers/:id/history — customer + payment plans + installments */
  getCustomerHistory(id: string): Observable<CustomerHistoryResponse | null> {
    return this.http
      .get<CustomerHistoryResponse>(`${this.customersUrl}/${id}/history`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  createCustomer(payload: CreateCustomerPayload): Observable<CustomerRecord> {
    return this.http.post<CustomerRecord>(this.customersUrl, payload, {
      headers: this.authHeaders(),
    });
  }

  getCustomers(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
  }): Observable<CustomersResponse> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 1))
      .set('limit', String(query.limit ?? 20));

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.sortKey && query.sortDirection) {
      params = params.set('sortBy', query.sortKey).set('sortOrder', query.sortDirection);
    }

    return this.http
      .get<CustomersResponse>(this.customersUrl, {
        params,
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() =>
          of({
            data: [],
            meta: {
              total: 0,
              page: query.page ?? 1,
              limit: query.limit ?? 20,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          })
        )
      );
  }
}
