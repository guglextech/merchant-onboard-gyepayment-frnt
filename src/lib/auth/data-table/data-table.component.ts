import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  DataTableActionEvent,
  DataTableColumn,
  DataTableColumnActionEvent,
  DataTableQuery,
  DataTableRowAction,
  DataTableSortDirection,
} from './data-table.types';

const AVATAR_PALETTES: string[] = [
  '#6366f1', // indigo
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#64748b', // slate
];

@Component({
  selector: 'lib-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T extends Record<string, unknown>>
  implements OnChanges
{
  @Input({ required: true }) columns: DataTableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() rowActions: DataTableRowAction<T>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found.';
  @Input() searchPlaceholder = 'Search...';
  @Input() searchable = true;
  @Input() serverSide = false;
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() initialPageSize = 10;
  @Input() trackByKey = '';

  @Output() queryChange = new EventEmitter<DataTableQuery>();
  @Output() rowAction = new EventEmitter<DataTableActionEvent<T>>();
  @Output() columnAction = new EventEmitter<DataTableColumnActionEvent>();
  @Output() rowClick = new EventEmitter<T>();

  protected searchTerm = '';
  protected page = 1;
  protected pageSize = this.initialPageSize;
  protected sortKey: string | null = null;
  protected sortDirection: DataTableSortDirection | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPageSize'] && this.initialPageSize > 0) {
      this.pageSize = this.initialPageSize;
    }

    if (changes['rows'] && !this.serverSide) {
      const maxPage = Math.max(1, this.totalPages);
      if (this.page > maxPage) {
        this.page = maxPage;
      }
    }
  }

  protected get filterableColumns(): DataTableColumn<T>[] {
    return this.columns.filter((column) => column.filterable !== false);
  }

  protected get activeRows(): T[] {
    if (this.serverSide) {
      return this.rows;
    }
    return this.applySort(this.applyFilter(this.rows));
  }

  protected get paginatedRows(): T[] {
    if (this.serverSide) {
      return this.rows;
    }
    const start = (this.page - 1) * this.pageSize;
    return this.activeRows.slice(start, start + this.pageSize);
  }

  protected get effectiveTotalItems(): number {
    return this.serverSide ? this.totalItems : this.activeRows.length;
  }

  protected get totalPages(): number {
    return Math.max(1, Math.ceil(this.effectiveTotalItems / this.pageSize));
  }

  protected get startRecord(): number {
    if (this.effectiveTotalItems === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  protected get endRecord(): number {
    return Math.min(this.page * this.pageSize, this.effectiveTotalItems);
  }

  protected get visiblePageNumbers(): number[] {
    const maxWindow = 5;
    const total = this.totalPages;
    const safePage = Math.min(this.page, total);
    const half = Math.floor(maxWindow / 2);
    let start = Math.max(1, safePage - half);
    const end = Math.min(total, start + maxWindow - 1);

    if (end - start < maxWindow - 1) {
      start = Math.max(1, end - maxWindow + 1);
    }

    const pages: number[] = [];
    for (let n = start; n <= end; n++) {
      pages.push(n);
    }
    return pages;
  }

  protected get hasRowActions(): boolean {
    return this.rowActions.length > 0;
  }

  protected resolveCellValue(row: T, column: DataTableColumn<T>): unknown {
    if (column.valueAccessor) return column.valueAccessor(row);
    return row[column.key];
  }

  protected renderCellValue(row: T, column: DataTableColumn<T>): string {
    const raw = this.resolveCellValue(row, column);
    if (column.formatter) return column.formatter(raw, row);
    if (raw === null || raw === undefined || raw === '') return '';
    return String(raw);
  }

  protected cellIsEmpty(row: T, column: DataTableColumn<T>): boolean {
    const raw = this.resolveCellValue(row, column);
    return raw === null || raw === undefined || raw === '';
  }

  protected badgeClass(row: T, column: DataTableColumn<T>): string | null {
    if (!column.badgeMap) return null;
    const value = this.resolveCellValue(row, column);
    const key = String(value ?? '').toLowerCase();
    return column.badgeMap[key] ?? column.badgeMap[String(value ?? '')] ?? 'dt-badge dt-badge--default';
  }

  /** Returns initials (up to 2 chars) from a text value. */
  protected getInitials(text: unknown): string {
    const str = String(text ?? '').trim();
    if (!str) return '?';
    const parts = str.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /** Deterministic background colour for an avatar based on first character. */
  protected getAvatarColor(text: unknown): string {
    const str = String(text ?? '').trim();
    if (!str) return AVATAR_PALETTES[0];
    const code = str.toUpperCase().charCodeAt(0) - 65;
    return AVATAR_PALETTES[Math.abs(code) % AVATAR_PALETTES.length];
  }

  /** Resolve the text used for avatar initials. */
  protected resolveAvatarText(row: T, column: DataTableColumn<T>): string {
    if (!column.avatarKey) return '';
    const raw = row[column.avatarKey];
    return String(raw ?? '');
  }

  protected sortState(column: DataTableColumn<T>): 'asc' | 'desc' | null {
    if (this.sortKey !== column.key) return null;
    return this.sortDirection;
  }

  protected toggleSort(column: DataTableColumn<T>): void {
    if (!column.sortable) return;

    if (this.sortKey !== column.key) {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortKey = null;
      this.sortDirection = null;
    }

    this.page = 1;
    this.emitQuery();
  }

  protected onSearchTermChange(value: string): void {
    this.searchTerm = value.trim().toLowerCase();
    this.page = 1;
    this.emitQuery();
  }

  protected onPageSizeChange(value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    this.pageSize = parsed;
    this.page = 1;
    this.emitQuery();
  }

  protected goToPage(target: number): void {
    const next = Math.max(1, Math.min(target, this.totalPages));
    if (next === this.page) return;
    this.page = next;
    this.emitQuery();
  }

  protected triggerRowAction(actionId: string, row: T, event?: Event): void {
    event?.stopPropagation();
    this.rowAction.emit({ actionId, row });
  }

  protected stopRowClick(event: Event): void {
    event.stopPropagation();
  }

  protected triggerRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  protected triggerColumnAction(actionId: string, columnKey: string): void {
    this.columnAction.emit({ actionId, columnKey });
  }

  protected isActionVisible(action: DataTableRowAction<T>, row: T): boolean {
    return action.isVisible ? action.isVisible(row) : true;
  }

  protected isActionDisabled(action: DataTableRowAction<T>, row: T): boolean {
    return action.isDisabled ? action.isDisabled(row) : false;
  }

  protected rowTrackBy = (index: number, row: T): unknown => {
    if (this.trackByKey && row[this.trackByKey] !== undefined) {
      return row[this.trackByKey];
    }
    return index;
  };

  private emitQuery(): void {
    this.queryChange.emit({
      page: this.page,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      sortKey: this.sortKey,
      sortDirection: this.sortDirection,
    });
  }

  private applyFilter(source: T[]): T[] {
    if (!this.searchTerm) return source;
    return source.filter((row) =>
      this.filterableColumns.some((col) => {
        const value = this.resolveCellValue(row, col);
        return String(value ?? '').toLowerCase().includes(this.searchTerm);
      })
    );
  }

  private applySort(source: T[]): T[] {
    if (!this.sortKey || !this.sortDirection) return source;
    const column = this.columns.find((c) => c.key === this.sortKey);
    if (!column) return source;

    return [...source].sort((a, b) => {
      const av = this.resolveCellValue(a, column);
      const bv = this.resolveCellValue(b, column);
      const an = Number(av);
      const bn = Number(bv);
      const numeric = Number.isFinite(an) && Number.isFinite(bn);
      const cmp = numeric
        ? an - bn
        : String(av ?? '').localeCompare(String(bv ?? ''), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }
}
