import { MerchantModel } from './admin-authentication.model';

export interface AuthSession {
  merchant?: MerchantModel;
  tokens?: { accessToken?: string };
  loggedInAt?: string;
}

/** @deprecated Use MerchantModel from admin-authentication.model */
export type AuthMerchant = MerchantModel;
