import { SettlementRecord } from '../models/settlement-record.model';

export type SettlementStatusFilter = SettlementRecord['status'] | 'All';

export const SETTLEMENT_STATUS_OPTIONS: SettlementStatusFilter[] = [
  'All',
  'Pending',
  'Completed',
  'Review',
  'Failed',
];
