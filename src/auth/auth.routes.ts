import { Route } from '@angular/router';
import { AuthShellComponent } from './components/auth-shell/auth-shell.component';
import { guestGuard } from './guards/auth.guard';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthShellComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/login/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'account',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/account/account-page.component').then(
            (m) => m.AccountPageComponent
          ),
      },
    ],
  },
];
