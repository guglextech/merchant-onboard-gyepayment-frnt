import { Component, signal } from '@angular/core';

interface NotificationPreferences {
  collectionAlerts: boolean;
  settlementReports: boolean;
  overdueReminders: boolean;
  systemUpdates: boolean;
  weeklyDigest: boolean;
}

@Component({
  selector: 'app-notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrl: './notifications-settings.component.scss',
})
export class NotificationsSettingsComponent {
  readonly notifications = signal<NotificationPreferences>({
    collectionAlerts: true,
    settlementReports: true,
    overdueReminders: true,
    systemUpdates: false,
    weeklyDigest: true,
  });

  toggle(key: keyof NotificationPreferences): void {
    this.notifications.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }
}
