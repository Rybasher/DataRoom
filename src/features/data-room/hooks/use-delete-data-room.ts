import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteDataRoom } from "@/features/data-room/api/data-room-repository";
import { dataRoomQueries } from "@/features/data-room/queries";

export function useDeleteDataRoom() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			try {
				await deleteDataRoom(id);
				await queryClient.invalidateQueries({
					queryKey: dataRoomQueries.key,
				});
			} catch (error) {
				console.log("Error deleting DataRoom:", error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("DataRoom deleted", {
				description: "DataRoom has been deleted successfully",
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to delete DataRoom", {
				description: error.message,
			});
		},
	});
}
