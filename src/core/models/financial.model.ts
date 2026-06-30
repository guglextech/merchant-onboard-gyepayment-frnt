export interface SummaryCard {
  icon: string;
  label: string;
  value: string;
  meta: string;
}

export type SettlementStatus = 'Pending' | 'Completed' | 'Review' | 'Failed';

export interface SettlementRecord {
  [key: string]: unknown;
  batch: string;
  merchant: string;
  amount: number;
  status: SettlementStatus;
  requestedAt: string;
}

export interface PlanStat {
  label: string;
  count: number;
  color: string;
}

export interface DashboardOverviewModel {
  greetingName: string;
  runPayrollLabel: string;
  paymentYearLabel: string;
  summaryCards: SummaryCard[];
  recentItems: DashboardRecentItem[];
  planStats: PlanStat[];
  successRate: number;
}

export interface DashboardFinancial {
  totalCollected: number;
  totalFees: number;
  totalSettled: number;
  availableBalance: number;
}

export interface DashboardPlans {
  active: number;
  paused: number;
  completed: number;
  defaulted: number;
  cancelled: number;
  total: number;
}

export interface DashboardCollections {
  today: Record<string, number>;
  successRate: number;
  last30Days: {
    failed?: number;
    successful?: number;
  };
}

export interface DashboardRecentItem {
  id: string;
  installment: {
    plan: {
      customer: { fullName: string };
      installmentCount: number;
    };
    installmentNo: number;
  };
  amount: string;
  status: string;
  resolvedAt: string;
  createdAt: string;
}

export interface DashboardApiResponse {
  financial: DashboardFinancial;
  plans: DashboardPlans;
  collections: DashboardCollections;
  recent: DashboardRecentItem[];
}
