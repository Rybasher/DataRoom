import { useQuery } from "@tanstack/react-query";

import { nodeQueries } from "@/features/file-system/queries";
import type { SortOption } from "@/types/sort";

interface Props {
	parentId: string | null;
	dataRoomId: string;
	sortBy?: SortOption | null;
}

/**
 * Fetch all children in one DB query.
 * `select` keeps the raw cache intact while returning a folders-first flat list
 * to the component — zero extra round-trips, no duplicate fetching.
 */
export function useNodes({ parentId, dataRoomId, sortBy }: Props) {
	return useQuery(nodeQueries.children(parentId, dataRoomId, sortBy));
}
