import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CreateMerchantPayload, MerchantRecord } from '@core/models/merchants.model';
import { MerchantsService } from '@core/services/merchants.service';
import { SideDrawerComponent } from '../../../../components/side-drawer/side-drawer.component';
import { getFormFieldError } from '../../../../utils/form-field-error.util';

@Component({
  selector: 'app-create-merchant-drawer',
  imports: [ReactiveFormsModule, SideDrawerComponent],
  templateUrl: './create-merchant-drawer.component.html',
  styleUrl: './create-merchant-drawer.component.scss',
})
export class CreateMerchantDrawerComponent {
  private readonly merchantsService = inject(MerchantsService);
  private readonly formBuilder = inject(FormBuilder);

  readonly isOpen = input(false);

  readonly closed = output<void>();
  readonly merchantCreated = output<MerchantRecord>();

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    businessName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^233\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
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
      password: 'Password must be at least 8 characters.',
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

    const payload = this.form.getRawValue() satisfies CreateMerchantPayload;
    this.submitting.set(true);
    this.submitError.set(null);

    this.merchantsService
      .registerMerchant(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (merchant) => {
          this.merchantCreated.emit(merchant);
          this.close();
        },
        error: (message: string) => {
          this.submitError.set(
            typeof message === 'string'
              ? message
              : 'Failed to create merchant. Please try again.'
          );
        },
      });
  }

  private resetForm(): void {
    this.submitError.set(null);
    this.form.reset();
  }
}
