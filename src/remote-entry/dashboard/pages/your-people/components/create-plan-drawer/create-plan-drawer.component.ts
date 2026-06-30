import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import { CustomerRecord } from '../../../../models/customer-record.model';
import { PlanFrequency } from '../../../../models/plan-setup-payload.model';
import { DashboardDataService } from '../../../../services/dashboard-data.service';
import { formatPhone } from '../../../../utils/customer-formatters.util';
import { getFormFieldError } from '../../../../utils/form-field-error.util';
import { mapPlanSetupPayload } from '../../../../utils/plan-payload.mapper';

@Component({
  selector: 'app-create-plan-drawer',
  imports: [ReactiveFormsModule, SideDrawerComponent],
  templateUrl: './create-plan-drawer.component.html',
  styleUrl: './create-plan-drawer.component.scss',
})
export class CreatePlanDrawerComponent {
  private readonly dashboardDataService = inject(DashboardDataService);
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input(false);
  readonly customer = input<CustomerRecord | null>(null);

  readonly closed = output<void>();
  readonly planCreated = output<void>();

  readonly frequencyOptions: PlanFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY'];
  readonly formatPhone = formatPhone;

  readonly subtitle = computed(() => {
    const selected = this.customer();
    return selected
      ? `Set up a plan for ${selected.fullName}`
      : 'Configure installment schedule and amounts.';
  });

  submitting = false;
  submitError: string | null = null;

  readonly form = this.fb.nonNullable.group({
    customerId: ['', Validators.required],
    mandateId: ['', Validators.required],
    description: ['', Validators.required],
    totalAmount: [0, [Validators.required, Validators.min(0.01)]],
    downPayment: [0, [Validators.required, Validators.min(0)]],
    installmentCount: [6, [Validators.required, Validators.min(1)]],
    frequency: ['MONTHLY' as PlanFrequency, Validators.required],
    startDate: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;
      this.resetForm(this.customer());
    });
  }

  fieldError(name: string): string | null {
    return getFormFieldError(this.form, name, {
      totalAmount: 'Enter an amount greater than 0.',
      downPayment: 'Down payment cannot exceed the total amount.',
      installmentCount: 'Enter at least 1 installment.',
    });
  }

  close(): void {
    this.closed.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = mapPlanSetupPayload(this.form.getRawValue());
    this.submitting = true;
    this.submitError = null;

    this.dashboardDataService
      .createPlanSetup(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => {
          this.planCreated.emit();
          this.close();
        },
        error: () => {
          this.submitError = 'Failed to create payment plan. Please try again.';
        },
      });
  }

  private resetForm(customer: CustomerRecord | null): void {
    this.submitError = null;
    this.form.reset({
      customerId: customer?.id ?? '',
      mandateId: customer?.activeMandateId ?? '',
      description: '',
      totalAmount: 0,
      downPayment: 0,
      installmentCount: 6,
      frequency: 'MONTHLY',
      startDate: new Date().toISOString().slice(0, 10),
    });
  }
}
