import { Component, signal } from '@angular/core';
import { PendingKybApplication } from '@core/models/kyb.model';
import { KybPendingDirectoryComponent, KybReviewDrawerComponent } from './components';

@Component({
  selector: 'app-kyb-setup-page',
  imports: [KybPendingDirectoryComponent, KybReviewDrawerComponent],
  templateUrl: './kyb-setup-page.component.html',
  styleUrl: './kyb-setup-page.component.scss',
})
export class KybSetupPageComponent {
  readonly reloadToken = signal(0);
  readonly reviewOpen = signal(false);
  readonly selectedApplication = signal<PendingKybApplication | null>(null);

  openReview(application: PendingKybApplication): void {
    this.selectedApplication.set(application);
    this.reviewOpen.set(true);
  }

  closeReview(): void {
    this.reviewOpen.set(false);
    this.selectedApplication.set(null);
  }

  onDecisionSubmitted(): void {
    this.reloadToken.update((token) => token + 1);
  }
}
