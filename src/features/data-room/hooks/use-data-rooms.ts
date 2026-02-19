import { useQuery} from "@tanstack/react-query";

import { dataRoomQueries } from "@/features/data-room/queries.ts";


export function useDataRooms() {
	return useQuery(dataRoomQueries.dataRooms());
}