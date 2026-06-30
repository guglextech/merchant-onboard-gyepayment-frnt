import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SETTINGS_SECTIONS } from './constants/settings.constants';
import {
  ApiIntegrationsSettingsComponent,
  BusinessProfileSettingsComponent,
  NotificationsSettingsComponent,
  SecuritySettingsComponent,
} from './components';

@Component({
  selector: 'app-settings-page',
  imports: [
    CommonModule,
    BusinessProfileSettingsComponent,
    SecuritySettingsComponent,
    NotificationsSettingsComponent,
    ApiIntegrationsSettingsComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  readonly sections = SETTINGS_SECTIONS;
  readonly activeSection = signal('profile');

  setSection(id: string): void {
    this.activeSection.set(id);
  }
}
