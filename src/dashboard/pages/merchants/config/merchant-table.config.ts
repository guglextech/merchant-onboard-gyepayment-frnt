import { DataTableColumn, DataTableRowAction } from '@gye-payment-backoffice/auth';
import { MerchantRecord } from '@core/models/merchants.model';
import { getMerchantStatusBadge } from '../constants/merchants.constants';
import {
  formatDateTime,
  formatMoney,
  formatPhone,
} from '../../../utils/customer-formatters.util';

export const MERCHANT_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

export const MERCHANT_TABLE_COLUMNS: DataTableColumn<MerchantRecord>[] = [
  {
    key: 'businessName',
    label: 'Merchant',
    sortable: true,
    avatarKey: 'businessName',
  },
  { key: 'merchantCode', label: 'Code', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'phone',
    label: 'Phone',
    sortable: true,
    formatter: (value) => formatPhone(String(value ?? '')),
  },
  { key: 'city', label: 'City', sortable: true },
  {
    key: 'availableBalance',
    label: 'Balance',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.availableBalance),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    formatter: (value) => String(value ?? 'Unknown'),
    badgeMap: {
      ACTIVE: 'dt-badge dt-badge--success',
      PENDING: 'dt-badge dt-badge--warning',
      SUSPENDED: 'dt-badge dt-badge--danger',
      INACTIVE: 'dt-badge dt-badge--muted',
    },
    valueAccessor: (row) => row.status,
  },
  {
    key: 'createdAt',
    label: 'Joined',
    sortable: true,
    valueAccessor: (row) => new Date(String(row.createdAt)).getTime(),
    formatter: (_, row) => formatDateTime(new Date(String(row.createdAt))),
  },
];

export const MERCHANT_ROW_ACTIONS: DataTableRowAction<MerchantRecord>[] = [
  { id: 'view', label: 'View Profile', iconClass: 'bi bi-eye' },
];

export { getMerchantStatusBadge };
