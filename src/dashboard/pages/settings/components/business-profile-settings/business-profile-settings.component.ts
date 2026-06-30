import { Component } from '@angular/core';
import { readAuthSession } from '../../../../utils/auth-session.util';

@Component({
  selector: 'app-business-profile-settings',
  templateUrl: './business-profile-settings.component.html',
  styleUrl: './business-profile-settings.component.scss',
})
export class BusinessProfileSettingsComponent {
  readonly admin = readAuthSession()?.admin ?? null;
}
