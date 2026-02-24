import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { nodeQueries } from "@/features/file-system/queries";
import type { PaginationParams } from "@/types/pagination";
import type { SortOption } from "@/types/sort";

export interface UseNodesParams {
	parentId: string | null;
	dataRoomId: string;
	sortBy?: SortOption | null;
	page?: PaginationParams;
}

export function useNodes({ parentId, dataRoomId, sortBy, page }: UseNodesParams) {
	return useQuery({
		...nodeQueries.children(parentId, dataRoomId, sortBy, page),
		placeholderData: keepPreviousData,
	});
}
