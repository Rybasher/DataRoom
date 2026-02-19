import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createDataRoom } from "@/features/data-room/api/data-room-repository";
import { dataRoomQueries } from "@/features/data-room/queries.ts";

export function useCreateDataRoom() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (name: string) => {
			try {
				const response = await createDataRoom(name);
				await queryClient.invalidateQueries({
					queryKey: dataRoomQueries.key,
				});
				return response;
			} catch (error) {
				console.log("Error creating Data Room:", error);
				throw error;
			}
		},
		onSuccess: (dataRoom) => {
			toast.success("Data Room created", {
				description: `"${dataRoom.name}" has been created successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error("Failed to create Data Room", {
				description: error.message,
			});
		},
	});
}
