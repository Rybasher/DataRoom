import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDataRoom from "@/features/data-room/components/delete-data-room";
import RenameDataRoom from "@/features/data-room/components/rename-data-room";
import { dataRoomQueries } from "@/features/data-room/queries";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import type { DataRoom } from "@/types/core.ts";

interface Props {
	dataRoom: DataRoom;
	/** Whether this card represents the currently active data room */
	isActive?: boolean;
}

export default function DataRoomCard({ dataRoom, isActive = false }: Props) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleCardClick = async (e: React.MouseEvent) => {
		// Prevent card click when clicking dropdown menu
		if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
			return;
		}

		await navigate(`/data-room/${dataRoom.id}`);
	};

	// After deleting the currently active room, redirect to the first remaining one
	const handleAfterDelete = useCallback(async () => {
		if (!isActive) return;

		const rooms =
			queryClient.getQueryData<DataRoom[]>(
				dataRoomQueries.dataRooms().queryKey,
			) ?? [];

		console.log(rooms);

		if (rooms.length > 0) {
			await navigate(`/data-room/${rooms[0].id}`);
		} else {
			await navigate("/");
		}
	}, [isActive, queryClient, navigate]);

	return (
		<>
			<Card
				className={cn(
					"cursor-pointer transition-colors py-0 shadow relative group",
					isActive
						? "bg-accent border-primary"
						: "border-transparent hover:bg-accent hover:border-border",
				)}
				onClick={handleCardClick}
			>
				<CardHeader className="p-4 pr-10">
					<CardTitle className={cn("text-sm", isActive && "text-primary")}>
						{dataRoom.name}
					</CardTitle>
					<CardDescription className="text-xs">
						Created {dayjs(dataRoom.createdAt).fromNow()}
					</CardDescription>
				</CardHeader>

				<div className="absolute top-2 right-2" data-dropdown-trigger>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								className="opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreVerticalIcon className="h-4 w-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									setRenameOpen(true);
								}}
							>
								<PencilIcon className="h-4 w-4" />
								Rename
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={(e) => {
									e.stopPropagation();
									setDeleteOpen(true);
								}}
							>
								<Trash2Icon className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Card>

			<RenameDataRoom
				dataRoom={dataRoom}
				open={renameOpen}
				onOpenChange={setRenameOpen}
			/>

			<DeleteDataRoom
				dataRoom={dataRoom}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				onDeleted={handleAfterDelete}
			/>
		</>
	);
}
