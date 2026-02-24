import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteNodes } from "@/features/file-system/api/node-repository";
import { nodeQueries } from "@/features/file-system/queries";
import { folderQueries } from "@/features/folder/queries";

export function useDeleteNodes() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (nodeIds: string[]) => {
			await deleteNodes(nodeIds);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: folderQueries.key }),
				queryClient.invalidateQueries({ queryKey: nodeQueries.key }),
			]);
		},
		onSuccess: (_, nodeIds) => {
			const count = nodeIds.length;
			toast.success(
				count === 1 ? "Item deleted" : `${count} items deleted`,
				{
					description:
						count === 1
							? "The item has been permanently deleted"
							: "The selected items have been permanently deleted",
				},
			);
		},
		onError: (error: Error) => {
			toast.error("Failed to delete items", {
				description: error.message,
			});
		},
	});
}
