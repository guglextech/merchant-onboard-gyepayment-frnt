import { PlanSetupPayload } from '../models/plan-setup-payload.model';

export function mapPlanSetupPayload(input: PlanSetupPayload): PlanSetupPayload {
  const safeTotal = Number(input.totalAmount) || 0;
  const safeDownPayment = Number(input.downPayment) || 0;

  return {
    customerId: input.customerId.trim(),
    mandateId: input.mandateId.trim(),
    description: input.description.trim(),
    totalAmount: safeTotal,
    downPayment: Math.min(Math.max(safeDownPayment, 0), safeTotal),
    installmentCount: Math.max(1, Math.trunc(Number(input.installmentCount) || 1)),
    frequency: input.frequency,
    startDate: normalizePlanDate(input.startDate),
  };
}

function normalizePlanDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}
