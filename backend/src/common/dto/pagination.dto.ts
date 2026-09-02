export class PaginatedDto {
  page: number = 1;
  limit: number = 20;
  search?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC' = 'ASC';
}

export class PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.total_pages = Math.ceil(total / limit);
  }
}
