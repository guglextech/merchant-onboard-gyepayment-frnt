import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { KybDecision, PendingKybApplication } from '@core/models/kyb.model';
import { KybService } from '@core/services/kyb.service';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import { getKybCompleteness } from '../../config/kyb-table.config';
import { formatDateTime, formatPhone, getInitials } from '../../../../utils/customer-formatters.util';

@Component({
  selector: 'app-kyb-review-drawer',
  imports: [CommonModule, DatePipe, ReactiveFormsModule, SideDrawerComponent],
  templateUrl: './kyb-review-drawer.component.html',
  styleUrl: './kyb-review-drawer.component.scss',
})
export class KybReviewDrawerComponent {
  private readonly kybService = inject(KybService);
  private readonly formBuilder = inject(FormBuilder);

  readonly isOpen = input(false);
  readonly application = input<PendingKybApplication | null>(null);

  readonly closed = output<void>();
  readonly decisionSubmitted = output<void>();

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly decisionForm = this.formBuilder.nonNullable.group({
    reason: ['', [Validators.required, Validators.minLength(3)]],
    notifyMerchant: [true],
  });

  readonly formatPhone = formatPhone;
  readonly formatDateTime = formatDateTime;
  readonly getInitials = getInitials;
  readonly getKybCompleteness = getKybCompleteness;

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.resetForm();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  docStatus(value: string | null): 'provided' | 'missing' {
    return value?.trim() ? 'provided' : 'missing';
  }

  canApprove(application: PendingKybApplication): boolean {
    return this.getKybCompleteness(application) === 3;
  }

  submitDecision(decision: KybDecision): void {
    const application = this.application();
    if (!application) return;

    this.errorMessage.set(null);

    if (this.decisionForm.invalid) {
      this.decisionForm.markAllAsTouched();
      return;
    }

    const { reason, notifyMerchant } = this.decisionForm.getRawValue();
    this.submitting.set(true);

    this.kybService
      .submitDecision(application.id, { decision, reason: reason.trim(), notifyMerchant })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.decisionSubmitted.emit();
          this.close();
        },
        error: (message: string) => {
          this.errorMessage.set(
            typeof message === 'string'
              ? message
              : 'Unable to submit KYB decision. Please try again.'
          );
        },
      });
  }

  private resetForm(): void {
    this.decisionForm.reset({ reason: '', notifyMerchant: true });
    this.errorMessage.set(null);
    this.submitting.set(false);
  }
}
