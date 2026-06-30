import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATHS } from '../api/api.constants';
import { BaseApiService } from '../http/base-api.service';
import { ApiKeyResponse } from '../models/system-control.model';

@Injectable({ providedIn: 'root' })
export class SystemControlService extends BaseApiService {
  generateApiKey(): Observable<ApiKeyResponse> {
    return this.http.post<ApiKeyResponse>(
      API_PATHS.systemControl.apiKey,
      {},
      { headers: this.authHeaders() }
    );
  }
}
