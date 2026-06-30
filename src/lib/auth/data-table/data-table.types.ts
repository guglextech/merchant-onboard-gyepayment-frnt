export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableHeaderAction {
  id: string;
  label: string;
  iconClass?: string;
}

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'start' | 'center' | 'end';
  /** Show a circular avatar with initials before the cell value. Pass the key to pull the text from (usually the same as `key`). */
  avatarKey?: string;
  /** Shown when the cell value is empty/null/undefined instead of a dash. */
  placeholderText?: string;
  headerAction?: DataTableHeaderAction;
  valueAccessor?: (row: T) => unknown;
  formatter?: (value: unknown, row: T) => string;
  badgeMap?: Record<string, string>;
}

export interface DataTableRowAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  iconClass?: string;
  variant?: 'default' | 'danger';
  isVisible?: (row: T) => boolean;
  isDisabled?: (row: T) => boolean;
}

export interface DataTableQuery {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortKey: string | null;
  sortDirection: DataTableSortDirection | null;
}

export interface DataTableActionEvent<T = Record<string, unknown>> {
  actionId: string;
  row: T;
}

export interface DataTableColumnActionEvent {
  actionId: string;
  columnKey: string;
}
