import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';
import { DASHBOARD_NAV_ITEMS } from '../../dashboard.routes';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { SwitcherComponent } from '../switcher/switcher.component';

@Component({
  selector: 'app-dashboard-shell',
  imports: [
    RouterOutlet,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    SwitcherComponent,
  ],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
})
export class DashboardShellComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  readonly sidebarItems = DASHBOARD_NAV_ITEMS.map(({ label, route, icon }) => ({
    label,
    route,
    icon,
  }));
  readonly pageTitle = signal('Overview');
  readonly userName = computed(
    () =>
      this.authService.getSession()?.admin.username ??
      this.authService.getSession()?.admin.email ??
      'Admin'
  );
  readonly userEmail = computed(
    () => this.authService.getSession()?.admin.email ?? ''
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.pageTitle.set(this.resolvePageTitle());
      });
  }

  private resolvePageTitle(): string {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot?.data?.['title'] ?? 'Overview';
  }
}
