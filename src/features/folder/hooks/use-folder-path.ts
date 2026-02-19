import { useQuery } from "@tanstack/react-query";

import { folderQueries } from "@/features/folder/queries";

export function useFolderPath(folderId: string | null) {
	return useQuery(folderQueries.path(folderId));
}
