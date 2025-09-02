export interface EventsResponse {
  data: Event[];
  success: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}