import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { PaginationQuery } from '../api/api.types';
import { BaseApiService } from '../http/base-api.service';
import {
  CreateCustomerPayload,
  CustomerHistoryResponse,
  CustomerProfile,
  CustomerRecord,
  CustomersResponse,
  PlanSetupPayload,
  PlansResponse,
} from '../models/customer-management.model';

@Injectable({ providedIn: 'root' })
export class CustomerManagementService extends BaseApiService {
  getCustomers(query: PaginationQuery): Observable<CustomersResponse> {
    return this.http
      .get<CustomersResponse>(API_PATHS.customerManagement.root, {
        params: this.buildPaginationParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(this.emptyPage<CustomerRecord>(query)))
      );
  }

  getCustomerProfile(id: string): Observable<CustomerProfile | null> {
    return this.http
      .get<CustomerProfile>(`${API_PATHS.customerManagement.root}/${id}`, {
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  getCustomerHistory(id: string): Observable<CustomerHistoryResponse | null> {
    return this.http
      .get<CustomerHistoryResponse>(
        `${API_PATHS.customerManagement.root}/${id}/history`,
        { headers: this.authHeaders() }
      )
      .pipe(
        timeout(15000),
        catchError(() => of(null))
      );
  }

  createCustomer(payload: CreateCustomerPayload): Observable<CustomerRecord> {
    return this.http.post<CustomerRecord>(
      API_PATHS.customerManagement.root,
      payload,
      { headers: this.authHeaders() }
    );
  }

  getPlans(query: PaginationQuery): Observable<PlansResponse> {
    return this.http
      .get<PlansResponse>(API_PATHS.customerManagement.plans, {
        params: this.buildPaginationParams(query),
        headers: this.authHeaders(),
      })
      .pipe(
        timeout(15000),
        catchError(() => of(this.emptyPage(query) as PlansResponse))
      );
  }

  createPlan(payload: PlanSetupPayload): Observable<PlanSetupPayload> {
    return this.http.post<PlanSetupPayload>(
      API_PATHS.customerManagement.plans,
      payload,
      { headers: this.authHeaders() }
    );
  }
}
