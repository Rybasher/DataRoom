import { useQuery } from "@tanstack/react-query";

import { folderQueries } from "@/features/folder/queries";
import type {SortOption} from "@/types/sort.ts";

interface Props {
	parentId: string | null;
	dataRoomId: string;
	sortBy?: SortOption | null;
}

export function useFolders({ parentId, dataRoomId, sortBy }: Props) {
	return useQuery(folderQueries.folders(parentId, dataRoomId, sortBy));
}
