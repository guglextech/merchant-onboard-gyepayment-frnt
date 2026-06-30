export interface MerchantModel {
  id: string;
  email: string;
  businessName: string;
  merchantCode: string;
  status: string;
}

export interface AuthTokensModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  accessTokenHash?: string;
  refreshTokenHash?: string;
}

export interface LoginResponseModel {
  merchant: MerchantModel;
  tokens: AuthTokensModel;
}

export interface AuthSessionModel {
  merchant: MerchantModel;
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
