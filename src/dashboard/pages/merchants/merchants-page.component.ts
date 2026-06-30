import { Component, signal } from '@angular/core';
import { MerchantRecord } from '@core/models/merchants.model';
import {
  CreateMerchantDrawerComponent,
  MerchantDirectoryComponent,
  MerchantProfileDrawerComponent,
} from './components';

@Component({
  selector: 'app-merchants-page',
  imports: [CreateMerchantDrawerComponent, MerchantDirectoryComponent, MerchantProfileDrawerComponent],
  templateUrl: './merchants-page.component.html',
  styleUrl: './merchants-page.component.scss',
})
export class MerchantsPageComponent {
  readonly directoryReloadToken = signal(0);
  readonly profileOpen = signal(false);
  readonly createMerchantOpen = signal(false);
  readonly profileMerchantId = signal<string | null>(null);

  openCreateMerchant(): void {
    this.createMerchantOpen.set(true);
  }

  closeCreateMerchant(): void {
    this.createMerchantOpen.set(false);
  }

  onMerchantCreated(): void {
    this.directoryReloadToken.update((token) => token + 1);
  }

  openProfile(merchant: MerchantRecord): void {
    this.profileMerchantId.set(merchant.id);
    this.profileOpen.set(true);
  }

  closeProfile(): void {
    this.profileOpen.set(false);
    this.profileMerchantId.set(null);
  }
}
