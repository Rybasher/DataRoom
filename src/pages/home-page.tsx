import DataRoomEmpty from "@/features/data-room/components/data-room-empty";
import DataRoomGrid from "@/features/data-room/components/data-room-grid";
import DataRoomGridSkeleton from "@/features/data-room/components/data-room-grid-skeleton";
import { useDataRooms } from "@/features/data-room/hooks";

export default function HomePage() {
	const { data: dataRooms, isLoading } = useDataRooms();

	if (!isLoading && !dataRooms?.length) {
		return <DataRoomEmpty />;
	}

	return (
		<div className="h-full overflow-auto p-6">
			{isLoading ? (
				<DataRoomGridSkeleton />
			) : (
				<DataRoomGrid dataRooms={dataRooms!} />
			)}
		</div>
	);
}
