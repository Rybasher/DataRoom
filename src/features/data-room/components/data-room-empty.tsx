import { FolderIcon } from "lucide-react";

import CreateDataRoom from "@/features/data-room/components/create-data-room";

export default function DataRoomEmpty() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4 text-center p-6">
			<FolderIcon className="h-16 w-16 text-muted-foreground/50" />
			<h2 className="text-2xl font-semibold">No Data Rooms</h2>
			<p className="text-muted-foreground">
				Create your first Data Room to get started
			</p>
			<CreateDataRoom />
		</div>
	);
}
