import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DataTableActionEvent, DataTableComponent } from '@gye-payment-backoffice/auth';
import { finalize } from 'rxjs';
import { PendingKybApplication } from '@core/models/kyb.model';
import { KybService } from '@core/services/kyb.service';
import {
  KYB_ROW_ACTIONS,
  KYB_TABLE_COLUMNS,
  KYB_TABLE_PAGE_SIZE_OPTIONS,
} from '../../config/kyb-table.config';

@Component({
  selector: 'app-kyb-pending-directory',
  imports: [DataTableComponent],
  templateUrl: './kyb-pending-directory.component.html',
  styleUrl: './kyb-pending-directory.component.scss',
})
export class KybPendingDirectoryComponent {
  private readonly kybService = inject(KybService);

  readonly reloadToken = input(0);
  readonly reviewApplication = output<PendingKybApplication>();

  readonly loading = signal(false);
  readonly rows = signal<PendingKybApplication[]>([]);

  readonly tablePageSize = 20;
  readonly tablePageSizeOptions = KYB_TABLE_PAGE_SIZE_OPTIONS;
  readonly columns = KYB_TABLE_COLUMNS;
  readonly rowActions = KYB_ROW_ACTIONS;

  constructor() {
    effect(() => {
      this.reloadToken();
      this.fetchPendingApplications();
    });
  }

  onRowAction(event: DataTableActionEvent<PendingKybApplication>): void {
    if (event.actionId === 'review' || event.actionId === 'approve' || event.actionId === 'reject') {
      this.reviewApplication.emit(event.row);
    }
  }

  onRowClick(row: PendingKybApplication): void {
    this.reviewApplication.emit(row);
  }

  private fetchPendingApplications(): void {
    this.loading.set(true);
    this.kybService
      .getPendingApplications()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (applications) => this.rows.set(applications),
        error: () => this.rows.set([]),
      });
  }
}
