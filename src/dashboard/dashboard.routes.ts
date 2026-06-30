import { Route } from '@angular/router';
import { DashboardShellComponent } from './components/dashboard-shell/dashboard-shell.component';
import { KybSetupPageComponent } from './pages/kyb-setup/kyb-setup-page.component';
import { MerchantsPageComponent } from './pages/merchants/merchants-page.component';
import { OverviewPageComponent } from './pages/overview/overview-page.component';
import { PlanSetupPageComponent } from './pages/plan-setup/plan-setup-page.component';
import { SettingsPageComponent } from './pages/settings/settings-page.component';
import { CustomerManagementPageComponent } from './pages/customer-management/customer-management-page.component';
import { DashboardNavItem } from './types/dashboard.types';

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    label: 'Platform',
    route: 'overview',
    title: 'Platform Overview',
    description: 'View BNPL performance, balances, and pending actions.',
    icon: 'bi-globe',
  },
  {
    label: 'KYB Setup',
    route: 'kyb-setup',
    title: 'KYB Setup',
    description: 'Configure KYB setup, rules, and eligibility settings.',
    icon: 'bi-gear',
  },
  {
    label: 'Merchants',
    route: 'merchants',
    title: 'Merchants',
    description: 'View merchant performance, balances, and pending actions.',
    icon: 'bi-people',
  },
  {
    label: 'Customers',
    route: 'customer-management',
    title: 'Customers',
    description: 'View customer performance, balances, and pending actions.',
    icon: 'bi-people',
  },
  {
    label: 'Reports',
    route: 'reports',
    title: 'Reports',
    description: 'Review operational reports and export dashboard insights.',
    icon: 'bi-file-earmark-text',
  },
  {
    label: 'Settings',
    route: 'settings',
    title: 'Settings',
    description: 'Manage workspace, account, and integration preferences.',
    icon: 'bi-sliders',
  },
];

const dashboardPageRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    component: OverviewPageComponent,
    data: { title: 'Overview' },
  },
  {
    path: 'kyb-setup',
    component: KybSetupPageComponent,
    data: { title: 'KYB Setup' },
  },
  {
    path: 'merchants',
    component: MerchantsPageComponent,
    data: { title: 'Merchants' },
  },
  {
    path: 'customer-management',
    component: CustomerManagementPageComponent,
    data: { title: 'Customers' },
  },
  {
    path: 'plan-setup',
    component: PlanSetupPageComponent,
    data: { title: 'Plan Setup' },
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    data: { title: 'Settings' },
  },
];

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardShellComponent,
    children: dashboardPageRoutes,
  },
];
