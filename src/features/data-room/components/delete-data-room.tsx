
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteDataRoom } from "@/features/data-room/hooks";
import type { DataRoom } from "@/types/core";

interface DeleteDataRoomProps {
	dataRoom: DataRoom;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Called after the data room is successfully deleted */
	onDeleted?: () => void;
}

export default function DeleteDataRoom({
	dataRoom,
	open,
	onOpenChange,
	onDeleted,
}: DeleteDataRoomProps) {
	const { mutate, isPending } = useDeleteDataRoom();

	const handleDelete = () => {
		mutate(dataRoom.id, {
			onSuccess: () => {
				onOpenChange(false);
				onDeleted?.();
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Data Room</DialogTitle>
					<DialogDescription>
							Are you sure you want to delete &ldquo;{dataRoom.name}&rdquo;? This action
							cannot be undone and will delete all files and folders inside this
							Data Room.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
							Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						loading={isPending}
					>
							Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
