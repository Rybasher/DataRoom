/** 1-based page to offset */
export function pageToOffset(page: number, limit: number): number {
	return (Math.max(1, page) - 1) * limit;
}

export function totalPages(total: number, limit: number): number {
	return Math.max(1, Math.ceil(total / limit));
}
