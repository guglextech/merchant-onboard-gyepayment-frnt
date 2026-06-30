import { PlanStat, SummaryCard } from './financial.model';

export interface FinancialBreakdownEntry {
  entryType: string;
  count: string | number;
  totalAmount: string;
  totalFees: string;
  totalNet: string;
}

export interface PlatformSummaryMerchants {
  total: number;
  active: number;
  pendingKyb: number;
}

export interface PlatformSummaryCustomers {
  total: number;
}

export interface PlatformSummaryPlans {
  active: number;
  defaulted: number;
}

export interface PlatformSummaryFinancials {
  grossVolume: number;
  totalRevenue: number;
  totalSettled: number;
  totalReversals: number;
  totalOutstanding: number;
  breakdown: FinancialBreakdownEntry[];
}

export interface PlatformSummaryResponse {
  merchants: PlatformSummaryMerchants;
  customers: PlatformSummaryCustomers;
  plans: PlatformSummaryPlans;
  financials: PlatformSummaryFinancials;
}

export interface PlatformOverviewModel {
  greetingName: string;
  paymentYearLabel: string;
  summaryCards: SummaryCard[];
  planStats: PlanStat[];
  settlementRate: number;
  breakdown: FinancialBreakdownEntry[];
}
