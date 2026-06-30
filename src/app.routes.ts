import { Route } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
  { path: '**', redirectTo: '' },
];
