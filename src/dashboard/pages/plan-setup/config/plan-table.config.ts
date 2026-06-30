import { DataTableColumn, DataTableRowAction } from '@gye-payment-backoffice/auth';
import { getPaymentStatusConfig } from '../../../constants/your-people.constants';
import { PlanRecord } from '../../../models/plan-record.model';
import { formatDateTime, formatMoney } from '../../../utils/customer-formatters.util';

export const PLAN_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

export const PLAN_TABLE_COLUMNS: DataTableColumn<PlanRecord>[] = [
  {
    key: 'description',
    label: 'Plan',
    sortable: true,
    formatter: (value) => String(value ?? 'Payment Plan'),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    formatter: (value) => getPaymentStatusConfig(String(value ?? '')).label,
    badgeMap: {
      ACTIVE: 'dt-badge dt-badge--success',
      PAUSED: 'dt-badge dt-badge--warning',
      COMPLETED: 'dt-badge dt-badge--success',
      DEFAULTED: 'dt-badge dt-badge--danger',
      CANCELLED: 'dt-badge dt-badge--default',
    },
  },
  {
    key: 'frequency',
    label: 'Frequency',
    sortable: true,
  },
  {
    key: 'totalAmount',
    label: 'Total',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.totalAmount),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  {
    key: 'paidAmount',
    label: 'Paid',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.paidAmount),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  {
    key: 'outstandingAmount',
    label: 'Outstanding',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.outstandingAmount),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  {
    key: 'installmentCount',
    label: 'Installments',
    sortable: true,
    align: 'center',
  },
  {
    key: 'startDate',
    label: 'Start Date',
    sortable: true,
    valueAccessor: (row) => new Date(String(row.startDate)).getTime(),
    formatter: (_, row) => formatDateTime(new Date(String(row.startDate))),
  },
];

export const PLAN_ROW_ACTIONS: DataTableRowAction<PlanRecord>[] = [
  { id: 'view', label: 'View Plan', iconClass: 'bi bi-eye' },
];
