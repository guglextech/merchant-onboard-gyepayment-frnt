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
