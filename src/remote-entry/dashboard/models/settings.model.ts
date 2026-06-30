export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ApiKeyResponse {
  rawKey: string;
  prefix: string;
}
