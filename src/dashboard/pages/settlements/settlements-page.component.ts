import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DataTableActionEvent,
  DataTableColumn,
  DataTableComponent,
  DataTableRowAction,
} from '@gye-payment-backoffice/auth';
import {
  SETTLEMENT_STATUS_OPTIONS,
  SettlementStatusFilter,
} from '../../constants/settlements.constants';
import { SettlementRecord } from '../../models/settlement-record.model';
import { FinancialService } from '@core/services/financial.service';

@Component({
  selector: 'app-settlements-page',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './settlements-page.component.html',
  styleUrl: './settlements-page.component.scss',
})
export class SettlementsPageComponent {
  private readonly financialService = inject(FinancialService);
  private readonly currencyFormatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 2,
  });

  loading = true;
  selectedStatus: SettlementStatusFilter = 'All';
  rows: SettlementRecord[] = [];

  readonly statusOptions = SETTLEMENT_STATUS_OPTIONS;

  readonly columns: DataTableColumn<SettlementRecord>[] = [
    {
      key: 'batch',
      label: 'Batch ID',
      sortable: true,
      filterable: true,
    },
    {
      key: 'merchant',
      label: 'Merchant',
      sortable: true,
      avatarKey: 'merchant',
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
      key: 'requestedAt',
      label: 'Requested At',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      badgeMap: {
        pending: 'dt-badge dt-badge--warning',
        completed: 'dt-badge dt-badge--success',
        review: 'dt-badge dt-badge--default',
        failed: 'dt-badge dt-badge--danger',
      },
    },
  ];

  readonly rowActions: DataTableRowAction<SettlementRecord>[] = [
    { id: 'view', label: 'View details', iconClass: 'bi bi-eye' },
    { id: 'download', label: 'Download receipt', iconClass: 'bi bi-download' },
    {
      id: 'retry',
      label: 'Retry transfer',
      iconClass: 'bi bi-arrow-repeat',
      isVisible: (row) => row.status === 'Failed' || row.status === 'Review',
    },
  ];

  get filteredRows(): SettlementRecord[] {
    if (this.selectedStatus === 'All') return this.rows;
    return this.rows.filter((row) => row.status === this.selectedStatus);
  }

  get metrics(): Array<{ label: string; value: string; meta: string }> {
    const pendingTotal = this.rows
      .filter((row) => row.status === 'Pending')
      .reduce((total, row) => total + row.amount, 0);
    const completedCount = this.rows.filter((row) => row.status === 'Completed').length;
    const failedCount = this.rows.filter((row) => row.status === 'Failed').length;

    return [
      {
        label: 'Pending Settlement',
        value: this.currencyFormatter.format(pendingTotal),
        meta: 'Awaiting approval',
      },
      {
        label: 'Completed Batches',
        value: String(completedCount),
        meta: 'Processed successfully',
      },
      {
        label: 'Failed Transfers',
        value: String(failedCount),
        meta: 'Needs review',
      },
    ];
  }

  constructor() {
    
  }

  onStatusFilterChange(value: string): void {
    if (value === 'All' || this.statusOptions.includes(value as SettlementRecord['status'])) {
      this.selectedStatus = value as SettlementStatusFilter;
    }
  }

  onRowAction(event: DataTableActionEvent<SettlementRecord>): void {
    console.info('[SettlementsTable] action', event.actionId, event.row);
  }
}
