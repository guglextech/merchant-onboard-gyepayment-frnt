export interface SettingsSection {
  id: string;
  label: string;
  icon: string;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: 'profile', label: 'Business Profile', icon: 'bi-building' },
  { id: 'security', label: 'Security', icon: 'bi-shield-lock' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-broadcast' },
  { id: 'integrations', label: 'API & Integrations', icon: 'bi-box-seam' },
];
