import { Component, signal } from '@angular/core';
import { CustomerRecord } from '../../models/customer-record.model';
import {
  CreateCustomerDrawerComponent,
  CreatePlanDrawerComponent,
  CustomerDirectoryComponent,
  CustomerProfileDrawerComponent,
} from './components';

@Component({
  selector: 'app-your-people-page',
  imports: [
    CustomerDirectoryComponent,
    CreateCustomerDrawerComponent,
    CreatePlanDrawerComponent,
    CustomerProfileDrawerComponent,
  ],
  templateUrl: './your-people-page.component.html',
  styleUrl: './your-people-page.component.scss',
})
export class YourPeoplePageComponent {
  readonly createCustomerOpen = signal(false);
  readonly createPlanOpen = signal(false);
  readonly profileOpen = signal(false);
  readonly directoryReloadToken = signal(0);

  readonly selectedCustomer = signal<CustomerRecord | null>(null);
  readonly profileCustomerId = signal<string | null>(null);

  openCreateCustomer(): void {
    this.createCustomerOpen.set(true);
  }

  closeCreateCustomer(): void {
    this.createCustomerOpen.set(false);
  }

  onCustomerCreated(): void {
    this.directoryReloadToken.update((token) => token + 1);
  }

  openCreatePlan(customer: CustomerRecord): void {
    this.selectedCustomer.set(customer);
    this.createPlanOpen.set(true);
  }

  closeCreatePlan(): void {
    this.createPlanOpen.set(false);
    this.selectedCustomer.set(null);
  }

  openProfile(customer: CustomerRecord): void {
    this.profileCustomerId.set(customer.id);
    this.profileOpen.set(true);
  }

  closeProfile(): void {
    this.profileOpen.set(false);
    this.profileCustomerId.set(null);
  }
}
