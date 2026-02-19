import { useQuery } from "@tanstack/react-query";

import { getDataRoomById } from "@/features/data-room/api/data-room-repository";
import { dataRoomQueries } from "@/features/data-room/queries";

export function useDataRoom(id: string | undefined) {
	return useQuery({
		...dataRoomQueries.detail(id!),
		queryFn: () => getDataRoomById(id!),
		enabled: !!id,
	});
}
