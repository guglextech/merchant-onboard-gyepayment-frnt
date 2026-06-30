import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-page',
  imports: [CommonModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss',
})
export class ReportsPageComponent {
  readonly metrics = [
    { label: 'Generated Reports', value: '32', meta: 'This month' },
    { label: 'Scheduled Exports', value: '7', meta: 'Recurring reports' },
    { label: 'Pending Reviews', value: '5', meta: 'Needs approval' },
  ];

  readonly reports = [
    { name: 'Collections Summary', period: 'June 2026', owner: 'Finance', status: 'Ready' },
    { name: 'Settlement Exceptions', period: 'June 2026', owner: 'Operations', status: 'Review' },
    { name: 'Branch Performance', period: 'Q2 2026', owner: 'Admin', status: 'Scheduled' },
  ];
}
