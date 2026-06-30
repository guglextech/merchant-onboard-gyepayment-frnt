import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DataTableActionEvent, DataTableComponent, DataTableQuery } from '@gye-payment-backoffice/auth';
import { finalize } from 'rxjs';
import { MerchantRecord } from '@core/models/merchants.model';
import { MerchantsService } from '@core/services/merchants.service';
import {
  MERCHANT_STATUS_FILTER_OPTIONS,
  MERCHANTS_DEFAULT_PAGE_SIZE,
  MerchantStatusFilter,
} from '../../constants/merchants.constants';
import {
  MERCHANT_ROW_ACTIONS,
  MERCHANT_TABLE_COLUMNS,
  MERCHANT_TABLE_PAGE_SIZE_OPTIONS,
} from '../../config/merchant-table.config';

@Component({
  selector: 'app-merchant-directory',
  imports: [DataTableComponent],
  templateUrl: './merchant-directory.component.html',
  styleUrl: './merchant-directory.component.scss',
})
export class MerchantDirectoryComponent {
  private readonly merchantsService = inject(MerchantsService);

  readonly reloadToken = input(0);

  readonly viewProfile = output<MerchantRecord>();
  readonly createMerchant = output<void>();

  readonly loading = signal(false);
  readonly allRows = signal<MerchantRecord[]>([]);
  readonly totalMerchants = signal(0);

  selectedStatus: MerchantStatusFilter = 'all';
  cityFilter = '';
  fromDate = '';
  toDate = '';

  readonly tablePageSize = MERCHANTS_DEFAULT_PAGE_SIZE;
  readonly tablePageSizeOptions = MERCHANT_TABLE_PAGE_SIZE_OPTIONS;
  readonly statusFilterOptions = MERCHANT_STATUS_FILTER_OPTIONS;
  readonly columns = MERCHANT_TABLE_COLUMNS;
  readonly rowActions = MERCHANT_ROW_ACTIONS;

  private tableQuery: DataTableQuery = {
    page: 1,
    pageSize: MERCHANTS_DEFAULT_PAGE_SIZE,
    searchTerm: '',
    sortKey: null,
    sortDirection: null,
  };

  constructor() {
    effect(() => {
      this.reloadToken();
      this.fetchMerchants(this.tableQuery);
    });
  }

  onTableQueryChange(query: DataTableQuery): void {
    this.tableQuery = query;
    this.fetchMerchants(query);
  }

  onStatusChange(value: string): void {
    const match = this.statusFilterOptions.find((option) => option.value === value);
    if (match) {
      this.selectedStatus = match.value;
      this.refetchFromFirstPage();
    }
  }

  onCityChange(value: string): void {
    this.cityFilter = value;
    this.refetchFromFirstPage();
  }

  onFromDateChange(value: string): void {
    this.fromDate = value;
    this.refetchFromFirstPage();
  }

  onToDateChange(value: string): void {
    this.toDate = value;
    this.refetchFromFirstPage();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedStatus !== 'all' ||
      this.cityFilter.trim().length > 0 ||
      this.fromDate.length > 0 ||
      this.toDate.length > 0
    );
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.cityFilter = '';
    this.fromDate = '';
    this.toDate = '';
    this.refetchFromFirstPage();
  }

  onRowAction(event: DataTableActionEvent<MerchantRecord>): void {
    if (event.actionId === 'view') {
      this.viewProfile.emit(event.row);
    }
  }

  onRowClick(row: MerchantRecord): void {
    this.viewProfile.emit(row);
  }

  private refetchFromFirstPage(): void {
    this.tableQuery = { ...this.tableQuery, page: 1 };
    this.fetchMerchants(this.tableQuery);
  }

  private fetchMerchants(query: DataTableQuery): void {
    this.loading.set(true);
    this.merchantsService
      .getMerchants({
        page: query.page,
        limit: query.pageSize,
        search: query.searchTerm || undefined,
        sortKey: query.sortKey ?? undefined,
        sortDirection: query.sortDirection ?? undefined,
        status: this.selectedStatus,
        city: this.cityFilter || undefined,
        from: this.fromDate || undefined,
        to: this.toDate || undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const data = response.data ?? [];
          this.allRows.set(data);
          this.totalMerchants.set(response.meta?.total ?? data.length);
        },
        error: () => {
          this.allRows.set([]);
          this.totalMerchants.set(0);
        },
      });
  }
}
