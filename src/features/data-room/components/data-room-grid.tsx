import { memo } from "react";

import CreateDataRoom from "@/features/data-room/components/create-data-room";
import DataRoomCard from "@/features/data-room/components/data-room-card";
import type { DataRoom } from "@/types/core";

interface DataRoomGridProps {
	dataRooms: DataRoom[];
}

const DataRoomGrid = memo(function DataRoomGrid({ dataRooms }: DataRoomGridProps) {
	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Data Rooms</h1>
					<p className="text-muted-foreground mt-1">
						Select a Data Room to view its contents
					</p>
				</div>
				<CreateDataRoom />
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{dataRooms.map((dataRoom) => (
					<DataRoomCard key={dataRoom.id} dataRoom={dataRoom} />
				))}
			</div>
		</>
	);
});

export default DataRoomGrid;
