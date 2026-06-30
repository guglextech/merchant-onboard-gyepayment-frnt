export type PlanFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface PlanSetupPayload {
  customerId: string;
  mandateId: string;
  description: string;
  totalAmount: number;
  downPayment: number;
  installmentCount: number;
  frequency: PlanFrequency;
  startDate: string; // yyyy-mm-dd
}

