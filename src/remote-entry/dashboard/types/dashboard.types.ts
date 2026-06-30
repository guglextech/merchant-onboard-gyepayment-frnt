export interface SummaryCard {
  icon: string;
  label: string;
  value: string;
  meta: string;
}

export interface TaskItem {
  title: string;
  detail: string;
}

export interface PayrollBar {
  month: string;
  yellow: number;
  red: number;
}

export interface DashboardNavItem {
  label: string;
  route: string;
  title: string;
  description: string;
  icon: string;
}

export interface DashboardSidebarItem {
  label: string;
  route: string;
  icon: string;
}
