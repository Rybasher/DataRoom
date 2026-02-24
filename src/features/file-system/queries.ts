import { queryOptions } from "@tanstack/react-query";

import { getChildren } from "@/features/file-system/api/node-repository";
import type { PaginationParams } from "@/types/pagination";
import type { SortOption } from "@/types/sort";

export const nodeQueries = {
	key: ["NODES"],
	children: (
		parentId: string | null,
		dataRoomId: string,
		sortBy?: SortOption | null,
		page?: PaginationParams,
	) =>
		queryOptions({
			queryKey: [
				...nodeQueries.key,
				dataRoomId,
				parentId ?? "root",
				sortBy ?? "default",
				page?.limit,
				page?.offset,
			],
			queryFn: () => getChildren(parentId, dataRoomId, sortBy, page),
			staleTime: 1000 * 60 * 5,
		}),
};
