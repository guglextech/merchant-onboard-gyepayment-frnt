import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import { DEFAULT_MOMO_CHANNEL, MOMO_CHANNELS } from '../../../../constants/your-people.constants';
import { CreateCustomerPayload, CustomerRecord } from '../../../../models/customer-record.model';
import { CustomerManagementService } from '@core/services/customer-management.service';
import { getFormFieldError } from '../../../../utils/form-field-error.util';

@Component({
  selector: 'app-create-customer-drawer',
  imports: [ReactiveFormsModule, SideDrawerComponent],
  templateUrl: './create-customer-drawer.component.html',
  styleUrl: './create-customer-drawer.component.scss',
})
export class CreateCustomerDrawerComponent {
  private readonly customerManagementService = inject(CustomerManagementService);
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input(false);

  readonly closed = output<void>();
  readonly customerCreated = output<CustomerRecord>();

  readonly momoChannels = MOMO_CHANNELS;
  submitting = false;
  submitError: string | null = null;

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^233\d{9}$/)]],
    momoChannel: [DEFAULT_MOMO_CHANNEL, [Validators.required]],
    email: ['', [Validators.email]],
    ghanaCardNumber: ['', [Validators.pattern(/^GHA-\d{9}-\d$/)]],
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.resetForm();
      }
    });
  }

  fieldError(name: string): string | null {
    return getFormFieldError(this.form, name, {
      phone: 'Use format 233XXXXXXXXX (12 digits, starts with 233).',
      ghanaCardNumber: 'Use format GHA-123456789-0.',
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

    const raw = this.form.getRawValue();
    const payload: CreateCustomerPayload = {
      fullName: raw.fullName!,
      phone: raw.phone!,
      momoChannel: raw.momoChannel!,
      ...(raw.email ? { email: raw.email } : {}),
      ...(raw.ghanaCardNumber ? { ghanaCardNumber: raw.ghanaCardNumber } : {}),
    };

    this.submitting = true;
    this.submitError = null;

    this.customerManagementService
      .createCustomer(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (customer) => {
          this.customerCreated.emit(customer);
          this.close();
        },
        error: () => {
          this.submitError = 'Failed to create customer. Please try again.';
        },
      });
  }

  private resetForm(): void {
    this.submitError = null;
    this.form.reset({ momoChannel: DEFAULT_MOMO_CHANNEL });
  }
}
