import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSidebarItem } from '../../types/dashboard.types';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  @Input({ required: true }) items: DashboardSidebarItem[] = [];
  @Input() currentUserInitial = 'B';
  @Input() currentUserName = 'Sam';
}
