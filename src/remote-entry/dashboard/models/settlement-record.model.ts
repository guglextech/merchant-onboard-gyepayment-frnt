export interface SettlementRecord {
  [key: string]: unknown;
  batch: string;
  merchant: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Review' | 'Failed';
  requestedAt: string;
}

