export interface AdminModel {
  id: string;
  email: string;
  username: string;
}

/** @deprecated Merchant session fields — use AdminModel for admin auth */
export interface MerchantModel {
  id: string;
  email: string;
  businessName: string;
  merchantCode: string;
  status: string;
}

export interface AuthTokensModel {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  accessTokenHash?: string;
  refreshTokenHash?: string;
}

export interface LoginResponseModel {
  accessToken: string;
  admin: AdminModel;
}

export interface AuthSessionModel {
  admin: AdminModel;
  tokens: AuthTokensModel;
  loggedInAt: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message?: string;
}
