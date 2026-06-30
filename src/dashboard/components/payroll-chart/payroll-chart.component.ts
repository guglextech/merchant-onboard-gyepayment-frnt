import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlanStat } from '../../models/dashboard-overview.model';

interface ChartSegment extends PlanStat {
  dashArray: string;
  dashOffset: string;
}

@Component({
  selector: 'app-payroll-chart',
  imports: [CommonModule],
  templateUrl: './payroll-chart.component.html',
  styleUrl: './payroll-chart.component.scss',
})
export class PayrollChartComponent {
  @Input({ required: true }) planStats: PlanStat[] = [];
  @Input() successRate = 0;
  @Input() yearLabel = 'This Year';

  readonly r = 42;
  readonly circumference = 2 * Math.PI * this.r;

  get total(): number {
    return this.planStats.reduce((s, p) => s + p.count, 0);
  }

  get chartSegments(): ChartSegment[] {
    const total = this.total;
    if (total === 0) return [];
    const c = this.circumference;
    let cumulative = 0;

    return this.planStats
      .filter(s => s.count > 0)
      .map(stat => {
        const length = (stat.count / total) * c;
        const dashArray = `${length.toFixed(2)} ${(c - length).toFixed(2)}`;
        const dashOffset = (c / 4 - cumulative).toFixed(2);
        cumulative += length;
        return { ...stat, dashArray, dashOffset };
      });
  }

  get successRingDash(): string {
    const filled = (this.successRate / 100) * this.circumference;
    return `${filled.toFixed(2)} ${(this.circumference - filled).toFixed(2)}`;
  }

  get successRingOffset(): string {
    return (this.circumference / 4).toFixed(2);
  }
}
