import { Link, Outlet } from "react-router-dom";
import { HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateDataRoom from "@/features/data-room/components/create-data-room";
import DataRoomList from "@/features/data-room/components/data-room-list";

export default function DataRoomLayout() {
	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Sidebar */}
			<aside className="w-64 border-r bg-sidebar">
				<div className="flex h-full flex-col">
					{/* Sidebar Header */}
					<div className="flex h-16 items-center justify-between border-b px-4">
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" asChild>
								<Link to="/">
									<HomeIcon className="h-4 w-4" />
								</Link>
							</Button>
							<h1 className="text-lg font-semibold">Data Room</h1>
						</div>
						<CreateDataRoom />
					</div>

					{/* Data Rooms List */}
					<DataRoomList />
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex flex-1 flex-col overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}
