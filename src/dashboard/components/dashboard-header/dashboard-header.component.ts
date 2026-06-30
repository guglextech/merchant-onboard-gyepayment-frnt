import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

interface ProfileMenuItem {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() title = 'Overview';
  @Input() userName = 'Merchant';
  @Input() userEmail = '';
  @Input() userRole = 'Workspace Admin';

  get initials(): string {
    const parts = this.userName.trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0));
    return letters.join('').toUpperCase() || 'GY';
  }

  protected readonly menuItems: ProfileMenuItem[] = [
    { label: 'My profile', icon: 'bi-person', route: 'overview' },
    { label: 'Account settings', icon: 'bi-gear', route: 'settings' },
    { label: 'Billing', icon: 'bi-credit-card', route: 'settlements' },
    { label: 'Notifications', icon: 'bi-bell' },
  ];

  protected signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
