import { CustomerInstallment } from './customer-record.model';

export interface PlanRecord {
  [key: string]: unknown;
  id: string;
  createdAt: string;
  updatedAt: string;
  merchantId: string;
  customerId: string;
  mandateId: string;
  description: string;
  totalAmount: string;
  downPayment: string;
  financedAmount: string;
  installmentCount: number;
  installmentAmount: string;
  frequency: string;
  startDate: string;
  endDate: string;
  paidAmount: string;
  outstandingAmount: string;
  paidInstallmentsCount: number;
  failedInstallmentsCount: number;
  status: string;
  pausedAt: string | null;
  completedAt: string | null;
  defaultedAt: string | null;
  branchId: string | null;
  feeRate: string;
  installments?: CustomerInstallment[];
}

export interface PlansMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PlansResponse {
  data: PlanRecord[];
  meta: PlansMeta;
}
