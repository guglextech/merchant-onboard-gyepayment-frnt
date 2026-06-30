import { DataTableColumn, DataTableRowAction } from '@gye-payment-backoffice/auth';
import { CustomerRecord } from '../../../models/customer-record.model';
import {
  formatChannel,
  formatDateTime,
  formatMoney,
  formatPhone,
} from '../../../utils/customer-formatters.util';

export const CUSTOMER_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

export const CUSTOMER_TABLE_COLUMNS: DataTableColumn<CustomerRecord>[] = [
  { key: 'fullName', label: 'Customer', sortable: true, avatarKey: 'fullName' },
  {
    key: 'phone',
    label: 'Phone',
    sortable: true,
    formatter: (value) => formatPhone(String(value ?? '')),
  },
  {
    key: 'momoChannel',
    label: 'Channel',
    sortable: true,
    formatter: (value) => formatChannel(String(value ?? '')),
  },
  {
    key: 'totalCollected',
    label: 'Collected',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.totalCollected),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  {
    key: 'totalOutstanding',
    label: 'Outstanding',
    sortable: true,
    align: 'end',
    valueAccessor: (row) => Number(row.totalOutstanding),
    formatter: (value) => formatMoney(Number(value ?? 0)),
  },
  { key: 'missedPaymentsCount', label: 'Missed', sortable: true, align: 'center' },
  {
    key: 'isBlacklisted',
    label: 'Status',
    sortable: true,
    valueAccessor: (row) => (row.isBlacklisted ? 'blacklisted' : 'active'),
    formatter: (value) => (String(value) === 'blacklisted' ? 'Blacklisted' : 'Active'),
    badgeMap: {
      blacklisted: 'dt-badge dt-badge--danger',
      active: 'dt-badge dt-badge--success',
    },
  },
  {
    key: 'createdAt',
    label: 'Joined',
    sortable: true,
    valueAccessor: (row) => new Date(String(row.createdAt)).getTime(),
    formatter: (_, row) => formatDateTime(new Date(String(row.createdAt))),
  },
];

export const CUSTOMER_ROW_ACTIONS: DataTableRowAction<CustomerRecord>[] = [
  { id: 'view', label: 'View Profile', iconClass: 'bi bi-eye' },
  { id: 'call', label: 'Call Customer', iconClass: 'bi bi-telephone' },
  {
    id: 'blacklist',
    label: 'Blacklist',
    iconClass: 'bi bi-person-x',
    variant: 'danger',
    isVisible: (row) => !row.isBlacklisted,
  },
  {
    id: 'create-plan',
    label: 'Create Plan',
    iconClass: 'bi bi-calendar-plus',
    isVisible: (row) => !row.isBlacklisted,
    isDisabled: (row) => row.isBlacklisted,
  },
];
