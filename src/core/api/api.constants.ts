export const API_BASE_URL = 'https://gye-payment-service.onrender.com/api/v1';

export const AUTH_SESSION_STORAGE_KEY = 'gye-auth-session';

/** Route groups aligned with backend API folders */
export const API_PATHS = {
  adminAuthentication: {
    root: `${API_BASE_URL}/admin/auth`,
    login: `${API_BASE_URL}/admin/auth/login`,
    password: `${API_BASE_URL}/admin/auth/password`,
  },
  kyb: {
    root: `${API_BASE_URL}/kyb`,
  },
  merchants: {
    root: `${API_BASE_URL}/merchants`,
    overview: `${API_BASE_URL}/dashboard/overview`,
  },
  collectionsOversight: {
    root: `${API_BASE_URL}/collections`,
  },
  financial: {
    root: `${API_BASE_URL}/financial`,
    settlements: `${API_BASE_URL}/settlements`,
    overview: `${API_BASE_URL}/dashboard/overview`,
  },
  customerManagement: {
    root: `${API_BASE_URL}/customers`,
    plans: `${API_BASE_URL}/plans`,
  },
  systemControl: {
    root: `${API_BASE_URL}/system`,
    apiKey: `${API_BASE_URL}/auth/api-key`,
  },
} as const;
