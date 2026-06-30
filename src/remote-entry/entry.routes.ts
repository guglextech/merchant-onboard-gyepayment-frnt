import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/components/dashboard-shell/dashboard-shell.component';
import { dashboardRoutes } from './dashboard/cores/dashboard.routes';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: DashboardShellComponent,
    children: dashboardRoutes,
  },
];
