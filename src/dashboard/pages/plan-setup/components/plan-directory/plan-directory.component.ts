import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DataTableActionEvent, DataTableComponent, DataTableQuery } from '@gye-payment-backoffice/auth';
import { finalize } from 'rxjs';
import { PlanRecord } from '../../../../models/plan-record.model';
import { CustomerManagementService } from '@core/services/customer-management.service';
import {
  PLAN_STATUS_FILTER_OPTIONS,
  PLANS_DEFAULT_PAGE_SIZE,
  PlanStatusFilter,
} from '../../constants/plan-setup.constants';
import {
  PLAN_ROW_ACTIONS,
  PLAN_TABLE_COLUMNS,
  PLAN_TABLE_PAGE_SIZE_OPTIONS,
} from '../../config/plan-table.config';

@Component({
  selector: 'app-plan-directory',
  imports: [DataTableComponent],
  templateUrl: './plan-directory.component.html',
  styleUrl: './plan-directory.component.scss',
})
export class PlanDirectoryComponent {
  private readonly customerManagementService = inject(CustomerManagementService);

  readonly reloadToken = input(0);

  readonly viewPlan = output<PlanRecord>();

  readonly loading = signal(false);
  readonly allRows = signal<PlanRecord[]>([]);
  readonly totalPlans = signal(0);
  selectedStatus: PlanStatusFilter = 'all';

  readonly tablePageSize = PLANS_DEFAULT_PAGE_SIZE;
  readonly tablePageSizeOptions = PLAN_TABLE_PAGE_SIZE_OPTIONS;
  readonly statusFilterOptions = PLAN_STATUS_FILTER_OPTIONS;
  readonly columns = PLAN_TABLE_COLUMNS;
  readonly rowActions = PLAN_ROW_ACTIONS;

  private tableQuery: DataTableQuery = {
    page: 1,
    pageSize: PLANS_DEFAULT_PAGE_SIZE,
    searchTerm: '',
    sortKey: null,
    sortDirection: null,
  };

  constructor() {
    effect(() => {
      this.reloadToken();
      this.fetchPlans(this.tableQuery);
    });
  }

  get rows(): PlanRecord[] {
    const source = this.allRows();
    if (this.selectedStatus === 'all') {
      return source;
    }
    return source.filter((row) => row.status === this.selectedStatus);
  }

  onTableQueryChange(query: DataTableQuery): void {
    this.tableQuery = query;
    this.fetchPlans(query);
  }

  onStatusChange(value: string): void {
    const match = this.statusFilterOptions.find((option) => option.value === value);
    if (match) {
      this.selectedStatus = match.value;
    }
  }

  onRowAction(event: DataTableActionEvent<PlanRecord>): void {
    if (event.actionId === 'view') {
      this.viewPlan.emit(event.row);
    }
  }

  onRowClick(row: PlanRecord): void {
    this.viewPlan.emit(row);
  }

  private fetchPlans(query: DataTableQuery): void {
    this.loading.set(true);
    this.customerManagementService
      .getPlans({
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
          this.totalPlans.set(response.meta?.total ?? data.length);
        },
        error: () => {
          this.allRows.set([]);
          this.totalPlans.set(0);
        },
      });
  }
}
