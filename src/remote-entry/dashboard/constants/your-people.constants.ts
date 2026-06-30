export type CustomerChannelFilter = 'all' | 'mtn-gh' | 'vodafone-gh' | 'airteltigo-gh';

export interface PaymentStatusStyle {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

export interface MomoChannelOption {
  value: string;
  label: string;
  color: string;
}

export interface ChannelFilterOption {
  value: CustomerChannelFilter;
  label: string;
}

export const CUSTOMER_CHANNEL_FILTER_OPTIONS: ChannelFilterOption[] = [
  { value: 'all', label: 'All Channels' },
  { value: 'mtn-gh', label: 'MTN' },
  { value: 'vodafone-gh', label: 'Vodafone' },
  { value: 'airteltigo-gh', label: 'AirtelTigo' },
];

export const DEFAULT_MOMO_CHANNEL = 'mtn-gh';

export const CUSTOMERS_DEFAULT_PAGE_SIZE = 20;

export const MOMO_CHANNELS: MomoChannelOption[] = [
  { value: 'mtn-gh', label: 'MTN Mobile Money', color: '#ffcc02' },
  { value: 'vodafone-gh', label: 'Vodafone Cash', color: '#e60000' },
  { value: 'airteltigo-gh', label: 'AirtelTigo Money', color: '#0099ff' },
];

export const PAYMENT_STATUS_CONFIG: Record<string, PaymentStatusStyle> = {
  PAID: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e', label: 'Paid' },
  FAILED: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444', label: 'Failed' },
  PENDING: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', label: 'Pending' },
  WAIVED: { bg: '#f5f3ff', text: '#6d28d9', dot: '#8b5cf6', label: 'Waived' },
  DUE: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: 'Due' },
  UPCOMING: { bg: '#f3f4f6', text: '#6b7280', dot: '#d1d5db', label: 'Upcoming' },
  COMPLETED: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e', label: 'Completed' },
  ACTIVE: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', label: 'Active' },
  PAUSED: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: 'Paused' },
  DEFAULTED: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444', label: 'Defaulted' },
  CANCELLED: { bg: '#f3f4f6', text: '#6b7280', dot: '#d1d5db', label: 'Cancelled' },
};

export const DEFAULT_PAYMENT_STATUS: PaymentStatusStyle = {
  bg: '#f3f4f6',
  text: '#6b7280',
  dot: '#d1d5db',
  label: 'Unknown',
};

export const INSTALLMENT_STATUSES = ['PAID', 'FAILED', 'PENDING', 'WAIVED', 'DUE', 'UPCOMING'] as const;

export const CHANNEL_LABELS_SHORT: Record<string, string> = {
  'mtn-gh': 'MTN',
  'vodafone-gh': 'Vodafone',
  'airteltigo-gh': 'AirtelTigo',
};

export const CHANNEL_LABELS_LONG: Record<string, string> = {
  'mtn-gh': 'MTN Mobile Money',
  'vodafone-gh': 'Vodafone Cash',
  'airteltigo-gh': 'AirtelTigo Money',
};

export function getPaymentStatusConfig(status: string): PaymentStatusStyle {
  return PAYMENT_STATUS_CONFIG[status] ?? { ...DEFAULT_PAYMENT_STATUS, label: status };
}
