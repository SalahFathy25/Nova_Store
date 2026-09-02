export class PaginatedDto {
    page = 1;
    limit = 20;
    search;
    sort_by;
    sort_order = 'ASC';
}
export class PaginatedResponse {
    data;
    total;
    page;
    limit;
    total_pages;
    constructor(data, total, page, limit) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.total_pages = Math.ceil(total / limit);
    }
}
//# sourceMappingURL=pagination.dto.js.map