import { PaginationQuery } from '../api/api.types';

export type MerchantStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';

export interface MerchantRecord {
  [key: string]: unknown;
  id: string;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  merchantCode: string;
  email: string;
  phone: string;
  status: MerchantStatus | string;
  ghanaCardNumber: string | null;
  tinNumber: string | null;
  businessRegNumber: string | null;
  kybVerifiedAt: string | null;
  hubtelAccountNumber: string | null;
  ussdShortcode: string | null;
  maxActivePlansPerCustomer: number;
  platformFeeRate: string;
  availableBalance: string;
  autoSettleEnabled: boolean;
  settlementPhone: string | null;
  settlementName: string | null;
  settlementChannel: string | null;
  address: string;
  city: string;
}

export interface MerchantsQuery extends PaginationQuery {
  status?: string;
  city?: string;
  from?: string;
  to?: string;
}

export interface MerchantDetailResponse {
  merchant: MerchantRecord;
}

export interface CreateMerchantPayload {
  businessName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
}
