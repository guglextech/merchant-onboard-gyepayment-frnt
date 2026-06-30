export type CollectionStatus = 'Due' | 'Collected' | 'Overdue' | 'Partially Paid';

export interface CollectionRecord {
  [key: string]: unknown;
  customer: string;
  plan: string;
  amount: number;
  dueDate: string;
  status: CollectionStatus;
}
