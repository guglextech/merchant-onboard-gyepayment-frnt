export type KybStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface KybProfile {
  id: string;
  businessName: string;
  registrationNumber?: string;
  status: KybStatus;
  updatedAt?: string;
}

export interface KybSubmissionPayload {
  businessName: string;
  registrationNumber: string;
  documents?: string[];
}

export interface PendingKybApplication {
  [key: string]: unknown;
  id: string;
  createdAt: string;
  businessName: string;
  email: string;
  phone: string;
  ghanaCardNumber: string | null;
  tinNumber: string | null;
  businessRegNumber: string | null;
}

export type KybDecision = 'APPROVE' | 'REJECT';

export interface KybDecisionPayload {
  decision: KybDecision;
  reason: string;
  notifyMerchant: boolean;
}

export interface KybDecisionResponse {
  message?: string;
}
