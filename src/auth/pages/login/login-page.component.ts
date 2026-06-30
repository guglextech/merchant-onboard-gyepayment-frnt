import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected submit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { login, password } = this.loginForm.getRawValue();
    this.isSubmitting.set(true);

    this.authService
      .login({ login, password })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination =
            returnUrl &&
            returnUrl.startsWith('/') &&
            !returnUrl.startsWith('/auth')
              ? returnUrl
              : '/';

          void this.router.navigateByUrl(destination);
        },
        error: (message: string) => {
          this.errorMessage.set(
            typeof message === 'string'
              ? message
              : 'Unable to sign in. Please try again.'
          );
        },
      });
  }
}
