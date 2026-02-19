import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteFile } from "@/features/file/api/file-repository";
import { nodeQueries } from "@/features/file-system/queries";

export function useDeleteFile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await deleteFile(id);
			await queryClient.invalidateQueries({ queryKey: nodeQueries.key });
		},
		onSuccess: () => {
			toast.success("File deleted", {
				description: "The file has been permanently deleted",
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to delete file", {
				description: error.message,
			});
		},
	});
}
