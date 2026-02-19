import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 8;

// Mimics the DataRoomCard layout (CardHeader with title + description lines)
function DataRoomCardSkeleton() {
	return (
		<div className="rounded-lg border p-4 space-y-2">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-3 w-1/2" />
		</div>
	);
}

export default function DataRoomGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: CARD_COUNT }).map((_, i) => (
				<DataRoomCardSkeleton key={i} />
			))}
		</div>
	);
}
