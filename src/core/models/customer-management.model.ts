export interface CreateCustomerPayload {
  fullName: string;
  phone: string;
  momoChannel: string;
  email?: string;
  ghanaCardNumber?: string;
}

export interface CustomerRecord {
  [key: string]: unknown;
  id: string;
  createdAt: string;
  updatedAt: string;
  merchantId: string;
  fullName: string;
  phone: string;
  email: string | null;
  momoChannel: string;
  ghanaCardNumber: string | null;
  totalCollected: string;
  totalOutstanding: string;
  missedPaymentsCount: number;
  isBlacklisted: boolean;
  branchId: string | null;
  activeMandateId: string | null;
}

export interface CustomerInstallment {
  id: string;
  createdAt: string;
  updatedAt: string;
  planId: string;
  installmentNo: number;
  dueDate: string;
  amount: string;
  status: string;
  paidAt: string | null;
  paidAmount: string | null;
  attemptsCount: number;
  lastAttemptedAt: string | null;
  nextRetryAt: string | null;
}

export interface CustomerPlan {
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
  installments: CustomerInstallment[];
}

export interface CustomerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  merchantId: string;
  fullName: string;
  phone: string;
  email: string | null;
  momoChannel: string;
  ghanaCardNumber: string | null;
  totalCollected: string;
  totalOutstanding: string;
  missedPaymentsCount: number;
  isBlacklisted: boolean;
  branchId: string | null;
  activeMandateId: string | null;
}

export interface CustomerHistoryResponse {
  customer: CustomerProfile;
  plans: CustomerPlan[];
  hasActiveMandate: boolean;
}

export interface CustomersMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomersResponse {
  data: CustomerRecord[];
  meta: CustomersMeta;
}

export type PlanFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface PlanSetupPayload {
  customerId: string;
  mandateId: string;
  description: string;
  totalAmount: number;
  downPayment: number;
  installmentCount: number;
  frequency: PlanFrequency;
  startDate: string;
}

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
