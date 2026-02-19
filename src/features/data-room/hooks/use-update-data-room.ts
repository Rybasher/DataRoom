import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateDataRoom } from "@/features/data-room/api/data-room-repository";
import { dataRoomQueries } from "@/features/data-room/queries";

interface UpdateDataRoomParams {
	id: string;
	name: string;
}

export function useUpdateDataRoom() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, name }: UpdateDataRoomParams) => {
			try {
				const response = await updateDataRoom(id, name);
				await queryClient.invalidateQueries({
					queryKey: dataRoomQueries.key,
				});
				return response;
			} catch (error) {
				console.log("Error updating DataRoom:", error);
				throw error;
			}
		},
		onSuccess: (dataRoom) => {
			toast.success("DataRoom updated", {
				description: `"${dataRoom.name}" has been updated successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to update DataRoom", {
				description: error.message,
			});
		},
	});
}
