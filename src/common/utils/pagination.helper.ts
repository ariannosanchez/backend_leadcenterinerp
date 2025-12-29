export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    count: number;
    page: number;
    totalPages: number
}

export interface PaginationResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export class PaginationHelper {
    static buildMeta(
        total: number,
        limit: number,
        offset: number,
        count: number
    ): PaginationMeta {
        const page = Math.floor(offset / limit) + 1;
        const totalPages = Math.ceil(total / limit);
        return {
            total,
            limit,
            offset,
            count,
            page,
            totalPages
        };
    }
}