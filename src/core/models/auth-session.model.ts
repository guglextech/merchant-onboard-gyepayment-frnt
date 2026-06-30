import { AdminModel } from './admin-authentication.model';

export interface AuthSession {
  admin?: AdminModel;
  tokens?: { accessToken?: string };
  loggedInAt?: string;
}

export type AuthAdmin = AdminModel;

/** @deprecated Use AuthAdmin */
export type AuthMerchant = AdminModel;
