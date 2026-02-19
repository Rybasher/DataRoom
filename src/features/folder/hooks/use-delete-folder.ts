import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { nodeQueries } from "@/features/file-system/queries";
import { deleteFolder } from "@/features/folder/api/folder-repository";
import { folderQueries } from "@/features/folder/queries";

export function useDeleteFolder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			try {
				await deleteFolder(id);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: folderQueries.key }),
					queryClient.invalidateQueries({ queryKey: nodeQueries.key }),
				]);
			} catch (error) {
				console.log("Error deleting folder:", error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Folder deleted", {
				description: "The folder and its contents have been deleted",
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to delete folder", {
				description: error.message,
			});
		},
	});
}

