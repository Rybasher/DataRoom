import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { renameFile } from "@/features/file/api/file-repository";
import { nodeQueries } from "@/features/file-system/queries";

interface RenameFileParams {
	id: string;
	name: string;
}

export function useRenameFile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, name }: RenameFileParams) => {
			try {
				const updated = await renameFile(id, name);
				await queryClient.invalidateQueries({ queryKey: nodeQueries.key });
				return updated;
			} catch (error) {
				console.log("Error renaming file:", error);
				throw error;
			}
		},
		onSuccess: (file) => {
			toast.success("File renamed", {
				description: `Renamed to "${file.name}" successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to rename file", {
				description: error.message,
			});
		},
	});
}
