import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { nodeQueries } from "@/features/file-system/queries";
import { renameFolder } from "@/features/folder/api/folder-repository";
import { folderQueries } from "@/features/folder/queries";

interface RenameFolderParams {
	id: string;
	name: string;
}

export function useRenameFolder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, name }: RenameFolderParams) => {
			try {
				const response = await renameFolder(id, name);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: folderQueries.key }),
					queryClient.invalidateQueries({ queryKey: nodeQueries.key }),
				]);
				return response;
			} catch (error) {
				console.log("Error renaming folder:", error);
				throw error;
			}
		},
		onSuccess: (folder) => {
			toast.success("Folder renamed", {
				description: `Renamed to "${folder.name}" successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to rename folder", {
				description: error.message,
			});
		},
	});
}

