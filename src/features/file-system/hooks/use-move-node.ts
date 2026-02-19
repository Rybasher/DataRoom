import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { moveNode } from "@/features/file-system/api/node-repository";
import { nodeQueries } from "@/features/file-system/queries";
import { folderQueries } from "@/features/folder/queries";

interface MoveNodeParams {
	id: string;
	targetParentId: string | null;
}

export function useMoveNode() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, targetParentId }: MoveNodeParams) => {
			const updatedNode = await moveNode(id, targetParentId);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: nodeQueries.key }),
				queryClient.invalidateQueries({ queryKey: folderQueries.key }),
			]);
			return updatedNode;
		},
		onSuccess: (node) => {
			toast.success("Item moved", {
				description: `"${node.name}" moved successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to move item", {
				description: error.message,
			});
		},
	});
}
