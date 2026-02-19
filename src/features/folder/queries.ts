import { queryOptions } from "@tanstack/react-query";

import { getFolderPath, getFolders } from "@/features/folder/api/folder-repository";
import type {SortOption} from "@/types/sort.ts";

export const folderQueries = {
	key: ["FOLDER"],
	folders: (parentId: string | null, dataRoomId: string, sortBy?: SortOption | null) =>
		queryOptions({
			queryKey: [...folderQueries.key, dataRoomId, parentId ?? "root", sortBy ?? "default"],
			queryFn: () => getFolders(parentId, dataRoomId, sortBy),
			staleTime: 1000 * 60 * 5,
		}),
	path: (folderId: string | null) =>
		queryOptions({
			queryKey: [...folderQueries.key, "path", folderId ?? "root"],
			queryFn: () => getFolderPath(folderId),
			staleTime: 1000 * 60 * 5,
		}),
};
