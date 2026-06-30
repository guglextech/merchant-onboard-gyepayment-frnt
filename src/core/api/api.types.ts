export type SortDirection = 'asc' | 'desc';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortKey?: string;
  sortDirection?: SortDirection;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
