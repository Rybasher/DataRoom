import { queryOptions } from "@tanstack/react-query";

import { getAllDataRooms, getDataRoomById } from "@/features/data-room/api/data-room-repository.ts";


export const DATA_ROOM = "DATA_ROOM";

export const dataRoomQueries = {
	key: ["DATA_ROOM"],
	dataRooms: () =>
		queryOptions({
			queryKey: [...dataRoomQueries.key],
			queryFn: () => getAllDataRooms(),
			staleTime: 1000 * 60 * 5
		}),
	detail: (id: string) =>
		queryOptions({
			queryKey: [...dataRoomQueries.key, id],
			queryFn: () => getDataRoomById(id),
			staleTime: 1000 * 60 * 5
		}),
};