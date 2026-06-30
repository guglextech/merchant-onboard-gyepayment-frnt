export interface CollectionRecord {
  [key: string]: unknown;
  customer: string;
  plan: string;
  amount: number;
  dueDate: string;
  status: 'Due' | 'Collected' | 'Overdue' | 'Partially Paid';
}

