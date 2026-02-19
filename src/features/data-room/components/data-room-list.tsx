import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import DataRoomCard from "@/features/data-room/components/data-room-card.tsx";
import { useDataRooms } from "@/features/data-room/hooks/use-data-rooms.ts";

export default function DataRoomList() {
	const { data } = useDataRooms();
	const { dataRoomId } = useParams<{ dataRoomId: string }>();

	// Keep the active data room pinned to the top of the list
	const sortedRooms = useMemo(() => {
		if (!data) return [];
		if (!dataRoomId) return data;

		return [
			...data.filter((r) => r.id === dataRoomId),
			...data.filter((r) => r.id !== dataRoomId),
		];
	}, [data, dataRoomId]);

	return (
		<ScrollArea className="flex-1 min-h-0 px-2 py-2">
			<div className="space-y-2 px-1 py-2">
				{sortedRooms.map((dataRoom) => (
					<DataRoomCard
						key={dataRoom.id}
						dataRoom={dataRoom}
						isActive={dataRoom.id === dataRoomId}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
