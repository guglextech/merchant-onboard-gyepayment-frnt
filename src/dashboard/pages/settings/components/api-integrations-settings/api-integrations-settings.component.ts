import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SystemControlService } from '@core/services/system-control.service';

@Component({
  selector: 'app-api-integrations-settings',
  templateUrl: './api-integrations-settings.component.html',
  styleUrl: './api-integrations-settings.component.scss',
})
export class ApiIntegrationsSettingsComponent {
  private readonly systemControlService = inject(SystemControlService);

  readonly rawKey = signal<string | null>(null);
  readonly prefix = signal<string | null>(null);
  readonly revealed = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly copied = signal(false);

  get hasKey(): boolean {
    return Boolean(this.rawKey() || this.prefix());
  }

  get displayKey(): string {
    if (this.revealed() && this.rawKey()) {
      return this.rawKey()!;
    }
    return this.prefix() ?? '';
  }

  generate(): void {
    this.loading.set(true);
    this.error.set(null);
    this.copied.set(false);

    this.systemControlService
      .generateApiKey()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (!response.rawKey) {
            this.error.set('API key was not returned. Please try again.');
            return;
          }
          this.rawKey.set(response.rawKey);
          this.prefix.set(response.prefix ?? maskKey(response.rawKey));
          this.revealed.set(true);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to generate API key. Please try again.');
        },
      });
  }

  toggleReveal(): void {
    if (!this.rawKey()) return;
    this.revealed.update((value) => !value);
  }

  async copyKey(): Promise<void> {
    const key = this.rawKey();
    if (!key) return;

    try {
      await navigator.clipboard.writeText(key);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.error.set('Could not copy to clipboard.');
    }
  }
}

function maskKey(rawKey: string): string {
  if (rawKey.length <= 12) return `${rawKey.slice(0, 4)}...`;
  return `${rawKey.slice(0, 12)}...`;
}
