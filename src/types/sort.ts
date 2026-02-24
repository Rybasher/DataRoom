export type SortOption =
	| "name-asc"
	| "name-desc"
	| "createdAt-asc"
	| "createdAt-desc"
	| "updatedAt-asc"
	| "updatedAt-desc"
	| "size-asc"
	| "size-desc"
	| null;

export const SORT_OPTIONS = [
	"name-asc",
	"name-desc",
	"createdAt-asc",
	"createdAt-desc",
	"updatedAt-asc",
	"updatedAt-desc",
	"size-asc",
	"size-desc",
] as const satisfies readonly NonNullable<SortOption>[];
