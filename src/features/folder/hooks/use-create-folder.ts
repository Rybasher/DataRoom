import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { nodeQueries } from "@/features/file-system/queries";
import { createFolder } from "@/features/folder/api/folder-repository";
import { folderQueries } from "@/features/folder/queries";

interface CreateFolderParams {
	name: string;
	parentId: string | null;
	dataRoomId: string;
}

export function useCreateFolder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ name, parentId, dataRoomId }: CreateFolderParams) => {
			try {
				const response = await createFolder(name, parentId, dataRoomId);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: folderQueries.key }),
					queryClient.invalidateQueries({ queryKey: nodeQueries.key }),
				]);
				return response;
			} catch (error) {
				console.log("Error creating folder:", error);
				throw error;
			}
		},
		onSuccess: (folder) => {
			toast.success("Folder created", {
				description: `"${folder.name}" has been created successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to create folder", {
				description: error.message,
			});
		},
	});
}
