import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import {
  getPaymentStatusConfig,
  INSTALLMENT_STATUSES,
} from '../../../../constants/your-people.constants';
import { PlanRecord } from '../../../../models/plan-record.model';
import { formatDateTime, formatMoney } from '../../../../utils/customer-formatters.util';

@Component({
  selector: 'app-plan-detail-drawer',
  imports: [CommonModule, DatePipe, SideDrawerComponent],
  templateUrl: './plan-detail-drawer.component.html',
  styleUrl: './plan-detail-drawer.component.scss',
})
export class PlanDetailDrawerComponent {
  readonly isOpen = input(false);
  readonly plan = input<PlanRecord | null>(null);

  readonly closed = output<void>();

  readonly installmentStatuses = INSTALLMENT_STATUSES;
  readonly statusCfg = getPaymentStatusConfig;
  readonly formatMoney = formatMoney;

  formatPlanDate(value: string): string {
    return formatDateTime(new Date(value));
  }

  close(): void {
    this.closed.emit();
  }
}
