import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import { MerchantRecord } from '@core/models/merchants.model';
import { MerchantsService } from '@core/services/merchants.service';
import { getMerchantStatusBadge } from '../../constants/merchants.constants';
import {
  formatDateTime,
  formatMoney,
  formatPhone,
  getInitials,
} from '../../../../utils/customer-formatters.util';

@Component({
  selector: 'app-merchant-profile-drawer',
  imports: [CommonModule, DatePipe, SideDrawerComponent],
  templateUrl: './merchant-profile-drawer.component.html',
  styleUrl: './merchant-profile-drawer.component.scss',
})
export class MerchantProfileDrawerComponent {
  private readonly merchantsService = inject(MerchantsService);

  readonly isOpen = input(false);
  readonly merchantId = input<string | null>(null);

  readonly closed = output<void>();

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly merchant = signal<MerchantRecord | null>(null);

  readonly formatPhone = formatPhone;
  readonly formatMoney = formatMoney;
  readonly getInitials = getInitials;
  readonly statusBadge = getMerchantStatusBadge;

  formatPlatformFeeRate(rate: string): string {
    return `${(Number(rate) * 100).toFixed(2)}%`;
  }

  formatKybVerifiedAt(value: string | null): string {
    return value ? formatDateTime(new Date(value)) : '—';
  }

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const id = this.merchantId();
      if (open && id) {
        this.loadMerchant(id);
      } else if (!open) {
        this.merchant.set(null);
        this.error.set(null);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  private loadMerchant(id: string): void {
    this.merchant.set(null);
    this.error.set(null);
    this.loading.set(true);

    this.merchantsService
      .getMerchant(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          if (data) {
            this.merchant.set(data);
          } else {
            this.error.set(
              'Could not load merchant profile. The record may be unavailable or you may not have permission to view it.'
            );
          }
        },
        error: () => {
          this.error.set('An unexpected error occurred while loading the profile.');
        },
      });
  }
}
