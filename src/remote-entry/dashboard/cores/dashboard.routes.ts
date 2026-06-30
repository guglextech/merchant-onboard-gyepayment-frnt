import { Route } from '@angular/router';
import { CollectionsPageComponent } from '../pages/collections/collections-page.component';
import { OverviewPageComponent } from '../pages/overview/overview-page.component';
import { PlanSetupPageComponent } from '../pages/plan-setup/plan-setup-page.component';
import { ReportsPageComponent } from '../pages/reports/reports-page.component';
import { SettlementsPageComponent } from '../pages/settlements/settlements-page.component';
import { YourPeoplePageComponent } from '../pages/your-people/your-people-page.component';
import { DashboardNavItem } from '../types/dashboard.types';
import { SettingsPageComponent } from '../pages/settings/settings-page.component';

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    label: 'Platform',
    route: 'platform-overview',
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
    label: 'Collections',
    route: 'collections',
    title: 'Collections',
    description: 'View collection performance, balances, and pending actions.',
    icon: 'bi-wallet2',
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

export const dashboardRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    component: OverviewPageComponent,
    data: { title: 'Overview' },
  },
  {
    path: 'settlements',
    component: SettlementsPageComponent,
    data: { title: 'Settlements' },
  },
  {
    path: 'collections',
    component: CollectionsPageComponent,
    data: { title: 'Collections' },
  },
  {
    path: 'your-people',
    component: YourPeoplePageComponent,
    data: { title: 'Your People' },
  },
  {
    path: 'plan-setup',
    component: PlanSetupPageComponent,
    data: { title: 'Plan Setup' },
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
    data: { title: 'Reports' },
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    data: { title: 'Settings' },
  },
];
