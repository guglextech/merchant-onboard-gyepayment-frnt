import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SwitcherItem {
  id: string;
  label: string;
  shortLabel: string;
  tone: 'green' | 'light' | 'red';
}

@Component({
  selector: 'app-switcher',
  imports: [CommonModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  activeSwitchId = 'zt';

  readonly switches: SwitcherItem[] = [
    { id: 'zt', label: 'Merchant Account', shortLabel: 'ZT', tone: 'green' }
  ];

  switchTo(itemId: string): void {
    this.activeSwitchId = itemId;
  }
}
