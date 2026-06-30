export type MerchantStatusFilter = 'all' | 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';

export interface MerchantStatusFilterOption {
  value: MerchantStatusFilter;
  label: string;
}

export const MERCHANT_STATUS_FILTER_OPTIONS: MerchantStatusFilterOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export const MERCHANTS_DEFAULT_PAGE_SIZE = 20;

export const MERCHANT_STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'dt-badge dt-badge--success',
  PENDING: 'dt-badge dt-badge--warning',
  SUSPENDED: 'dt-badge dt-badge--danger',
  INACTIVE: 'dt-badge dt-badge--muted',
};

export function getMerchantStatusBadge(status: string): string {
  return MERCHANT_STATUS_BADGE[status] ?? 'dt-badge';
}
