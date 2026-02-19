
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateDataRoom, useUpdateDataRoomForm } from "@/features/data-room/hooks";
import type { DataRoom } from "@/types/core";

interface RenameDataRoomProps {
	dataRoom: DataRoom;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function RenameDataRoom({
	dataRoom,
	open,
	onOpenChange,
}: RenameDataRoomProps) {
	const form = useUpdateDataRoomForm(dataRoom.name);
	const { mutate, isPending } = useUpdateDataRoom();

	const onSubmit = form.handleSubmit((values) => {
		mutate(
			{ id: dataRoom.id, name: values.name },
			{ onSuccess: () => onOpenChange(false) }
		);
	});

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Rename Data Room</DialogTitle>
						<DialogDescription>
								Enter a new name for your Data Room.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="rename-name">Name</Label>
							<Input
								id="rename-name"
								placeholder="Enter Data Room name"
								autoComplete="off"
								autoFocus
								{...form.register("name")}
								aria-invalid={!!form.formState.errors.name}
							/>
							{form.formState.errors.name && (
								<p className="text-sm text-destructive">
									{form.formState.errors.name.message}
								</p>
							)}
						</div>
					</div>

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
							type="submit"
							disabled={!form.formState.isValid}
							loading={isPending}
						>
								Rename
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
