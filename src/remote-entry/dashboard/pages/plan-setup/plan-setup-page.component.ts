import { Component, signal } from '@angular/core';
import { PlanRecord } from '../../models/plan-record.model';
import { PlanDetailDrawerComponent, PlanDirectoryComponent } from './components';

@Component({
  selector: 'app-plan-setup-page',
  imports: [PlanDirectoryComponent, PlanDetailDrawerComponent],
  templateUrl: './plan-setup-page.component.html',
  styleUrl: './plan-setup-page.component.scss',
})
export class PlanSetupPageComponent {
  readonly detailOpen = signal(false);
  readonly directoryReloadToken = signal(0);
  readonly selectedPlan = signal<PlanRecord | null>(null);

  openPlan(plan: PlanRecord): void {
    this.selectedPlan.set(plan);
    this.detailOpen.set(true);
  }

  closePlan(): void {
    this.detailOpen.set(false);
    this.selectedPlan.set(null);
  }
}
