import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DataTableActionEvent, DataTableComponent, DataTableQuery } from '@gye-payment-backoffice/auth';
import { finalize } from 'rxjs';
import {
  CUSTOMER_CHANNEL_FILTER_OPTIONS,
  CUSTOMERS_DEFAULT_PAGE_SIZE,
  CustomerChannelFilter,
} from '../../../../constants/your-people.constants';
import { CustomerRecord } from '../../../../models/customer-record.model';
import { DashboardDataService } from '../../../../services/dashboard-data.service';
import {
  CUSTOMER_ROW_ACTIONS,
  CUSTOMER_TABLE_COLUMNS,
  CUSTOMER_TABLE_PAGE_SIZE_OPTIONS,
} from '../../config/customer-table.config';

@Component({
  selector: 'app-customer-directory',
  imports: [DataTableComponent],
  templateUrl: './customer-directory.component.html',
  styleUrl: './customer-directory.component.scss',
})
export class CustomerDirectoryComponent {
  private readonly dashboardDataService = inject(DashboardDataService);

  readonly reloadToken = input(0);

  readonly viewProfile = output<CustomerRecord>();
  readonly createPlan = output<CustomerRecord>();

  readonly loading = signal(false);
  readonly allRows = signal<CustomerRecord[]>([]);
  readonly totalCustomers = signal(0);
  selectedChannel: CustomerChannelFilter = 'all';

  readonly tablePageSize = CUSTOMERS_DEFAULT_PAGE_SIZE;
  readonly tablePageSizeOptions = CUSTOMER_TABLE_PAGE_SIZE_OPTIONS;
  readonly channelFilterOptions = CUSTOMER_CHANNEL_FILTER_OPTIONS;
  readonly columns = CUSTOMER_TABLE_COLUMNS;
  readonly rowActions = CUSTOMER_ROW_ACTIONS;

  private tableQuery: DataTableQuery = {
    page: 1,
    pageSize: CUSTOMERS_DEFAULT_PAGE_SIZE,
    searchTerm: '',
    sortKey: null,
    sortDirection: null,
  };

  constructor() {
    effect(() => {
      this.reloadToken();
      this.fetchCustomers(this.tableQuery);
    });
  }

  get rows(): CustomerRecord[] {
    const source = this.allRows();
    if (this.selectedChannel === 'all') {
      return source;
    }
    return source.filter((row) => row.momoChannel === this.selectedChannel);
  }

  onTableQueryChange(query: DataTableQuery): void {
    this.tableQuery = query;
    this.fetchCustomers(query);
  }

  onChannelChange(value: string): void {
    const match = this.channelFilterOptions.find((option) => option.value === value);
    if (match) {
      this.selectedChannel = match.value;
    }
  }

  onRowAction(event: DataTableActionEvent<CustomerRecord>): void {
    if (event.actionId === 'view') {
      this.viewProfile.emit(event.row);
      return;
    }

    if (event.actionId === 'create-plan') {
      this.createPlan.emit(event.row);
    }
  }

  onRowClick(row: CustomerRecord): void {
    this.viewProfile.emit(row);
  }

  private fetchCustomers(query: DataTableQuery): void {
    this.loading.set(true);
    this.dashboardDataService
      .getCustomers({
        page: query.page,
        limit: query.pageSize,
        search: query.searchTerm || undefined,
        sortKey: query.sortKey ?? undefined,
        sortDirection: query.sortDirection ?? undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const data = response.data ?? [];
          this.allRows.set(data);
          this.totalCustomers.set(response.meta?.total ?? data.length);
        },
        error: () => {
          this.allRows.set([]);
          this.totalCustomers.set(0);
        },
      });
  }
}
