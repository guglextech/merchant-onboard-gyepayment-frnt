export type PlanStatusFilter = 'all' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';

export interface PlanStatusFilterOption {
  value: PlanStatusFilter;
  label: string;
}

export const PLANS_DEFAULT_PAGE_SIZE = 20;

export const PLAN_STATUS_FILTER_OPTIONS: PlanStatusFilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DEFAULTED', label: 'Defaulted' },
  { value: 'CANCELLED', label: 'Cancelled' },
];
