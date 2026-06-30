import { FormGroup } from '@angular/forms';

export function getFormFieldError(
  form: FormGroup,
  name: string,
  customMessages: Record<string, string> = {}
): string | null {
  const ctrl = form.get(name);
  if (!ctrl?.touched || !ctrl.invalid) return null;
  if (ctrl.errors?.['required']) return 'This field is required.';
  if (ctrl.errors?.['minlength']) {
    return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
  }
  if (ctrl.errors?.['maxlength']) {
    return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters.`;
  }
  if (ctrl.errors?.['email']) return 'Enter a valid email address.';
  if (ctrl.errors?.['min']) return customMessages[name] ?? `Minimum value is ${ctrl.errors['min'].min}.`;
  if (ctrl.errors?.['pattern']) return customMessages[name] ?? 'Invalid value.';
  return customMessages[name] ?? 'Invalid value.';
}
