export declare class PaginatedDto {
    page: number;
    limit: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}
export declare class PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    constructor(data: T[], total: number, page: number, limit: number);
}
