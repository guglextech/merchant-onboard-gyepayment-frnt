import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, startWith } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import {
  PlatformOverviewModel,
  PlatformSummaryResponse,
} from '@core/models/platform-summary.model';
import { PlanStat } from '../../models/dashboard-overview.model';
import { PlatformSummaryService } from '@core/services/platform-summary.service';
import {
  DashboardSupportPanelComponent,
  PayrollChartComponent,
  SummaryCardsComponent,
} from '../../shared/components';

@Component({
  selector: 'app-overview-page',
  imports: [
    CommonModule,
    SummaryCardsComponent,
    PayrollChartComponent,
    DashboardSupportPanelComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
})
export class OverviewPageComponent {
  private readonly platformSummaryService = inject(PlatformSummaryService);
  private readonly authService = inject(AuthService);

  private readonly fallbackOverview: PlatformOverviewModel = {
    greetingName: this.resolveGreetingName(),
    paymentYearLabel: `Platform · ${new Date().getFullYear()}`,
    summaryCards: [
      { icon: 'bi-shop', label: 'Merchants', value: '0', meta: '0 active · 0 pending KYB' },
      { icon: 'bi-people', label: 'Customers', value: '0', meta: 'Across all merchants' },
      { icon: 'bi-cash-stack', label: 'Gross Volume', value: 'GHS 0.00', meta: 'Platform-wide' },
      { icon: 'bi-graph-up-arrow', label: 'Platform Revenue', value: 'GHS 0.00', meta: 'Fees collected' },
      { icon: 'bi-bank', label: 'Total Settled', value: 'GHS 0.00', meta: 'Paid out to merchants' },
      { icon: 'bi-wallet2', label: 'Outstanding', value: 'GHS 0.00', meta: 'Awaiting settlement' },
    ],
    planStats: [
      { label: 'Active', count: 0, color: '#22c55e' },
      { label: 'Defaulted', count: 0, color: '#ef4444' },
    ],
    settlementRate: 0,
    breakdown: [],
  };

  readonly overview$ = this.platformSummaryService.getSummary().pipe(
    map((data) => this.mapSummaryResponse(data)),
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

  formatGhs(value: number | string): string {
    return `GHS ${Number(value).toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  formatEntryType(entryType: string): string {
    return entryType
      .split('_')
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }

  private resolveGreetingName(): string {
    return (
      this.authService.getSession()?.admin.username ??
      this.authService.getSession()?.admin.email ??
      'Admin'
    );
  }

  private mapSummaryResponse(data: PlatformSummaryResponse | null): PlatformOverviewModel {
    if (!data) return this.fallbackOverview;

    const { merchants, customers, plans, financials } = data;
    const settlementRate =
      financials.grossVolume > 0
        ? Math.round((financials.totalSettled / financials.grossVolume) * 100)
        : 0;

    const summaryCards = [
      {
        icon: 'bi-shop',
        label: 'Merchants',
        value: String(merchants.total),
        meta: `${merchants.active} active · ${merchants.pendingKyb} pending KYB`,
      },
      {
        icon: 'bi-people',
        label: 'Customers',
        value: String(customers.total),
        meta: 'Across all merchants',
      },
      {
        icon: 'bi-cash-stack',
        label: 'Gross Volume',
        value: this.formatGhs(financials.grossVolume),
        meta: `${financials.breakdown.length} entry type${financials.breakdown.length !== 1 ? 's' : ''}`,
      },
      {
        icon: 'bi-graph-up-arrow',
        label: 'Platform Revenue',
        value: this.formatGhs(financials.totalRevenue),
        meta: `GHS ${financials.totalReversals.toFixed(2)} reversals`,
      },
      {
        icon: 'bi-bank',
        label: 'Total Settled',
        value: this.formatGhs(financials.totalSettled),
        meta: 'Paid out to merchants',
      },
      {
        icon: 'bi-wallet2',
        label: 'Outstanding',
        value: this.formatGhs(financials.totalOutstanding),
        meta: 'Awaiting settlement',
      },
    ];

    const planStats: PlanStat[] = [
      { label: 'Active', count: plans.active, color: '#22c55e' },
      { label: 'Defaulted', count: plans.defaulted, color: '#ef4444' },
    ];

    return {
      greetingName: this.resolveGreetingName(),
      paymentYearLabel: `Platform · ${new Date().getFullYear()}`,
      summaryCards,
      planStats,
      settlementRate,
      breakdown: financials.breakdown ?? [],
    };
  }
}
