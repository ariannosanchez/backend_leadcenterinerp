export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    count: number;
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
        return {
            total,
            limit,
            offset,
            count,
        };
    }
}