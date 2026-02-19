import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDataRoom } from "@/features/data-room/hooks";
import { useDataRoomForm } from "@/features/data-room/hooks/use-data-room-form";

export default function CreateDataRoom() {
	const [open, setOpen] = useState(false);
	const form = useDataRoomForm();

	const { mutate, isPending } = useCreateDataRoom();

	const onSubmit = form.handleSubmit((values) => {
		mutate(values.name, { onSuccess: () => {
			setOpen(false);
			form.reset();
		}});
	});

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="icon" variant="ghost">
					<PlusIcon className="h-4 w-4" />
					<span className="sr-only">Create new Data Room</span>
				</Button>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Data Room</DialogTitle>
						<DialogDescription>
								Enter a name for your new Data Room. You can change this later.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
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
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!form.formState.isValid}
							loading={isPending}
						>
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
