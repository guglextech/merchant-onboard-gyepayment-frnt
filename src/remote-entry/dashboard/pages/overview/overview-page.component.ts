import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, startWith } from 'rxjs';
import {
  DashboardApiResponse,
  DashboardOverviewModel,
  PlanStat,
} from '../../models/dashboard-overview.model';
import { DashboardDataService } from '../../services/dashboard-data.service';
import {
  DashboardSupportPanelComponent,
  PayrollChartComponent,
  SummaryCardsComponent,
} from '../../shared/components';

@Component({
  selector: 'app-overview-page',
  imports: [
    CommonModule,
    DatePipe,
    SummaryCardsComponent,
    PayrollChartComponent,
    DashboardSupportPanelComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
})
export class OverviewPageComponent {
  private readonly dashboardDataService = inject(DashboardDataService);

  private readonly fallbackOverview: DashboardOverviewModel = {
    greetingName: 'Merchant',
    runPayrollLabel: 'Run Collection',
    paymentYearLabel: `This Year - ${new Date().getFullYear()}`,
    summaryCards: [
      { icon: 'bi-cash-stack', label: 'Total Collected', value: 'GHS 0.00', meta: 'All time' },
      { icon: 'bi-wallet2', label: 'Available Balance', value: 'GHS 0.00', meta: 'After fees' },
      { icon: 'bi-people', label: 'Active Plans', value: '0', meta: '0 total plans' },
    ],
    recentItems: [],
    planStats: [
      { label: 'Active', count: 0, color: '#22c55e' },
      { label: 'Paused', count: 0, color: '#f97316' },
      { label: 'Completed', count: 0, color: '#3b82f6' },
      { label: 'Defaulted', count: 0, color: '#ef4444' },
      { label: 'Cancelled', count: 0, color: '#9ca3af' },
    ],
    successRate: 0,
  };

  readonly overview$ = this.dashboardDataService.getOverview().pipe(
    map((data) => this.mapApiResponse(data)),
    startWith(this.fallbackOverview)
  );

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get currentTime(): string {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }

  private formatGhs(value: number): string {
    return `GHS ${value.toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  private mapApiResponse(data: DashboardApiResponse | null): DashboardOverviewModel {
    if (!data) return this.fallbackOverview;

    const { financial, plans, collections, recent } = data;

    const summaryCards = [
      {
        icon: 'bi-cash-stack',
        label: 'Total Collected',
        value: this.formatGhs(financial.totalCollected),
        meta: `GHS ${financial.totalFees.toFixed(2)} in fees`,
      },
      {
        icon: 'bi-wallet2',
        label: 'Available Balance',
        value: this.formatGhs(financial.availableBalance),
        meta: `GHS ${financial.totalSettled.toFixed(2)} settled`,
      },
      {
        icon: 'bi-people',
        label: 'Active Plans',
        value: String(plans.active),
        meta: `${plans.total} total · ${plans.defaulted} defaulted`,
      },
    ];

    const planStats: PlanStat[] = [
      { label: 'Active', count: plans.active, color: '#22c55e' },
      { label: 'Paused', count: plans.paused, color: '#f97316' },
      { label: 'Completed', count: plans.completed, color: '#3b82f6' },
      { label: 'Defaulted', count: plans.defaulted, color: '#ef4444' },
      { label: 'Cancelled', count: plans.cancelled, color: '#9ca3af' },
    ];

    return {
      greetingName: 'Merchant',
      runPayrollLabel: 'Run Collection',
      paymentYearLabel: `This Year - ${new Date().getFullYear()}`,
      summaryCards,
      recentItems: recent,
      planStats,
      successRate: collections.successRate,
    };
  }
}
