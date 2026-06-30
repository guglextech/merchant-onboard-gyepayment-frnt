import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SettingsService } from '../../../../services/settings.service';
import { getFormFieldError } from '../../../../utils/form-field-error.util';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!newPassword || !confirmPassword) return null;
  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-security-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.scss',
})
export class SecuritySettingsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  submitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  readonly form = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  fieldError(name: string): string | null {
    if (name === 'confirmPassword' && this.form.errors?.['passwordMismatch'] && this.form.get('confirmPassword')?.touched) {
      return 'Passwords do not match.';
    }
    return getFormFieldError(this.form, name, {
      newPassword: 'Use at least 8 characters.',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.submitting = true;
    this.submitError = null;
    this.submitSuccess = null;

    this.settingsService
      .changePassword({ currentPassword: currentPassword!, newPassword: newPassword! })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response) => {
          this.submitSuccess = response.message ?? 'Password updated successfully.';
          this.form.reset();
        },
        error: (err) => {
          this.submitError =
            err?.error?.message ?? 'Failed to update password. Check your current password and try again.';
        },
      });
  }
}
