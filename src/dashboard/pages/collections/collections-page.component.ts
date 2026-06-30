import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DataTableActionEvent,
  DataTableColumn,
  DataTableComponent,
  DataTableRowAction,
} from '@gye-payment-backoffice/auth';
import { CollectionRecord } from '../../models/collection-record.model';
import { CollectionsOversightService } from '@core/services/collections-oversight.service';

@Component({
  selector: 'app-collections-page',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.scss',
})
export class CollectionsPageComponent {
  private readonly collectionsOversightService = inject(CollectionsOversightService);
  private readonly currencyFormatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 2,
  });

  loading = true;
  selectedStatus: CollectionRecord['status'] | 'All' = 'All';
  rows: CollectionRecord[] = [];

  readonly statusOptions: Array<CollectionRecord['status'] | 'All'> = [
    'All',
    'Due',
    'Collected',
    'Overdue',
    'Partially Paid',
  ];

  readonly columns: DataTableColumn<CollectionRecord>[] = [
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      avatarKey: 'customer',
    },
    {
      key: 'plan',
      label: 'Plan',
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'end',
      valueAccessor: (row) => row.amount,
      formatter: (value) => this.currencyFormatter.format(Number(value ?? 0)),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      badgeMap: {
        due: 'dt-badge dt-badge--warning',
        collected: 'dt-badge dt-badge--success',
        overdue: 'dt-badge dt-badge--danger',
        'partially paid': 'dt-badge dt-badge--default',
      },
    },
  ];

  readonly rowActions: DataTableRowAction<CollectionRecord>[] = [
    { id: 'view', label: 'View plan', iconClass: 'bi bi-eye' },
    { id: 'remind', label: 'Send reminder', iconClass: 'bi bi-bell' },
    {
      id: 'resolve',
      label: 'Mark resolved',
      iconClass: 'bi bi-check2-circle',
      isVisible: (row) => row.status !== 'Collected',
    },
  ];

  get filteredRows(): CollectionRecord[] {
    if (this.selectedStatus === 'All') return this.rows;
    return this.rows.filter((row) => row.status === this.selectedStatus);
  }

  get metrics(): Array<{ label: string; value: string; meta: string }> {
    const dueTotal = this.rows
      .filter((row) => row.status === 'Due' || row.status === 'Overdue')
      .reduce((total, row) => total + row.amount, 0);
    const recovered = this.rows
      .filter((row) => row.status === 'Collected')
      .reduce((total, row) => total + row.amount, 0);
    const overdueCount = this.rows.filter((row) => row.status === 'Overdue').length;

    return [
      { label: 'Due Collections', value: this.currencyFormatter.format(dueTotal), meta: 'Open balances' },
      { label: 'Recovered', value: this.currencyFormatter.format(recovered), meta: 'Collected to date' },
      { label: 'Overdue Accounts', value: String(overdueCount), meta: 'Requires follow-up' },
    ];
  }

  constructor() {
  
  }

  onStatusFilterChange(value: string): void {
    if (value === 'All' || this.statusOptions.includes(value as CollectionRecord['status'])) {
      this.selectedStatus = value as CollectionRecord['status'] | 'All';
    }
  }

  onRowAction(event: DataTableActionEvent<CollectionRecord>): void {
    switch (event.actionId) {
      case 'view':
      case 'remind':
      case 'resolve':
      default:
        break;
    }
  }
}
