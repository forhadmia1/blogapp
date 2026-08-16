interface SortOptionsProps {
    limit?: string;
    orderBy?: string;
    sortBy?: string;
    page?: string;
}

type SortOptionReturn = {
    skip: number;
    limit: number;
    orderBy: string;
    sortBy: string;
    page: number;
}

export const PaginationSortingHelper = (payload: SortOptionsProps): SortOptionReturn => {
    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;
    const sortBy = payload.sortBy ? payload.sortBy : 'createdAt';
    const orderBy = payload.orderBy ? payload?.orderBy : 'asc';
    const skip = (page - 1) * limit

    return {
        skip,
        limit,
        orderBy,
        sortBy,
        page
    }
}