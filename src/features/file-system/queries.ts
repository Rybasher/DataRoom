import { queryOptions } from "@tanstack/react-query";

import { getChildren } from "@/features/file-system/api/node-repository";
import type { SortOption } from "@/types/sort";

export const nodeQueries = {
	key: ["NODES"],
	children: (
		parentId: string | null,
		dataRoomId: string,
		sortBy?: SortOption | null,
	) =>
		queryOptions({
			queryKey: [
				...nodeQueries.key,
				dataRoomId,
				parentId ?? "root",
				sortBy ?? "default",
			],
			queryFn: () => getChildren(parentId, dataRoomId, sortBy),
			staleTime: 1000 * 60 * 5,
		}),
};
