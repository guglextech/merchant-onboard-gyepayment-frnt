import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardRecentItem } from '../../models/dashboard-overview.model';

@Component({
  selector: 'app-dashboard-support-panel',
  imports: [CommonModule],
  templateUrl: './dashboard-support-panel.component.html',
  styleUrl: './dashboard-support-panel.component.scss',
})
export class DashboardSupportPanelComponent {
  @Input({ required: true }) recentItems: DashboardRecentItem[] = [];

  statusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
        return 'badge--success';
      case 'FAILED':
        return 'badge--failed';
      case 'PENDING':
        return 'badge--pending';
      default:
        return 'badge--neutral';
    }
  }
}
