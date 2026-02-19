import { useState } from "react";
import { FolderPlusIcon } from "lucide-react";

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
import { useCreateFolder, useFolderForm } from "@/features/folder/hooks";

interface CreateFolderProps {
	parentId: string | null;
	dataRoomId: string;
}

export default function CreateFolder({
	parentId,
	dataRoomId,
}: CreateFolderProps) {
	const [open, setOpen] = useState(false);
	const form = useFolderForm();
	const { mutate, isPending } = useCreateFolder();

	const onSubmit = form.handleSubmit((values) => {
		mutate(
			{ name: values.name, parentId, dataRoomId },
			{ onSuccess: () => {
				setOpen(false);
				form.reset({ name: "", });
			}}
		);
	});

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) form.reset({ name: "", });
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<FolderPlusIcon className="h-4 w-4" />
						New Folder
				</Button>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Folder</DialogTitle>
						<DialogDescription>
								Enter a name for your new folder.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="folder-name">Name</Label>
							<Input
								id="folder-name"
								placeholder="Enter folder name"
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
