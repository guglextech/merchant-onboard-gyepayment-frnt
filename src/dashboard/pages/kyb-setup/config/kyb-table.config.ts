import { DataTableColumn, DataTableRowAction } from '@gye-payment-backoffice/auth';
import { PendingKybApplication } from '@core/models/kyb.model';
import { formatDateTime, formatPhone } from '../../../utils/customer-formatters.util';

export const KYB_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

export function getKybCompleteness(application: PendingKybApplication): number {
  return [application.ghanaCardNumber, application.tinNumber, application.businessRegNumber].filter(
    Boolean
  ).length;
}

export const KYB_TABLE_COLUMNS: DataTableColumn<PendingKybApplication>[] = [
  {
    key: 'businessName',
    label: 'Merchant',
    sortable: true,
    avatarKey: 'businessName',
  },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'phone',
    label: 'Phone',
    sortable: true,
    formatter: (value) => formatPhone(String(value ?? '')),
  },
  // {
  //   key: 'ghanaCardNumber',
  //   label: 'Ghana Card',
  //   sortable: true,
  //   formatter: (value) => (value ? String(value) : '—'),
  // },
  {
    key: 'tinNumber',
    label: 'TIN',
    sortable: true,
    formatter: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'businessRegNumber',
    label: 'Business Reg.',
    sortable: true,
    formatter: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'createdAt',
    label: 'Submitted',
    sortable: true,
    valueAccessor: (row) => new Date(String(row.createdAt)).getTime(),
    formatter: (_, row) => formatDateTime(new Date(String(row.createdAt))),
  },
  {
    key: 'id',
    label: 'Status',
    sortable: false,
    valueAccessor: (row) => getKybCompleteness(row),
    formatter: (_, row) => {
      const complete = getKybCompleteness(row);
      return complete === 3 ? 'Ready for review' : `${complete}/3 docs`;
    },
    badgeMap: {
      '0': 'dt-badge dt-badge--danger',
      '1': 'dt-badge dt-badge--warning',
      '2': 'dt-badge dt-badge--warning',
      '3': 'dt-badge dt-badge--success',
    },
  },
];

export const KYB_ROW_ACTIONS: DataTableRowAction<PendingKybApplication>[] = [
  { id: 'review', label: 'Review & decide', iconClass: 'bi bi-eye' },
  {
    id: 'approve',
    label: 'Approve',
    iconClass: 'bi bi-check-circle',
    isVisible: (row) => getKybCompleteness(row) === 3,
  },
  {
    id: 'reject',
    label: 'Reject',
    iconClass: 'bi bi-x-circle',
    variant: 'danger',
  },
];
