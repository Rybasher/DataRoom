export interface PaginationParams {
	limit: number;
	offset: number;
}

export interface PaginationResult<T> {
	items: T[];
	total: number;
}
