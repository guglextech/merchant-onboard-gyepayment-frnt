import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import {
  getPaymentStatusConfig,
  INSTALLMENT_STATUSES,
} from '../../../../constants/your-people.constants';
import { CustomerHistoryResponse } from '../../../../models/customer-record.model';
import { CustomerManagementService } from '@core/services/customer-management.service';
import {
  formatChannel,
  formatMoney,
  formatPhone,
  getInitials,
} from '../../../../utils/customer-formatters.util';

@Component({
  selector: 'app-customer-profile-drawer',
  imports: [CommonModule, DatePipe, SideDrawerComponent],
  templateUrl: './customer-profile-drawer.component.html',
  styleUrl: './customer-profile-drawer.component.scss',
})
export class CustomerProfileDrawerComponent {
  private readonly customerManagementService = inject(CustomerManagementService);

  readonly isOpen = input(false);
  readonly customerId = input<string | null>(null);

  readonly closed = output<void>();

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly profile = signal<CustomerHistoryResponse | null>(null);

  readonly installmentStatuses = INSTALLMENT_STATUSES;
  readonly statusCfg = getPaymentStatusConfig;
  readonly formatPhone = formatPhone;
  readonly formatChannel = formatChannel;
  readonly formatMoney = formatMoney;
  readonly getInitials = getInitials;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const id = this.customerId();
      if (open && id) {
        this.loadProfile(id);
      } else if (!open) {
        this.profile.set(null);
        this.error.set(null);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  private loadProfile(id: string): void {
    this.profile.set(null);
    this.error.set(null);
    this.loading.set(true);

    this.customerManagementService
      .getCustomerHistory(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          if (data) {
            this.profile.set(data);
          } else {
            this.error.set(
              'Could not load customer profile. The record may be unavailable or you may not have permission to view it.'
            );
          }
        },
        error: () => {
          this.error.set('An unexpected error occurred while loading the profile.');
        },
      });
  }
}
