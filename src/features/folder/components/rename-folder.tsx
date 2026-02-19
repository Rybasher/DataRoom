import { useEffect } from "react";

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
import { useFolderForm, useRenameFolder } from "@/features/folder/hooks";
import type { FolderNode } from "@/types/core";

interface RenameFolderProps {
	folder: FolderNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function RenameFolder({ folder, open, onOpenChange }: RenameFolderProps) {
	const form = useFolderForm(folder.name);
	const { mutate, isPending } = useRenameFolder();

	// Sync form value with the current folder name every time the dialog opens
	useEffect(() => {
		if (open) {
			form.reset({ name: folder.name });
		}
	}, [open, folder.name, form]);

	const handleClose = () => {
		form.reset({ name: folder.name });
		onOpenChange(false);
	};

	const onSubmit = form.handleSubmit((values) => {
		mutate(
			{ id: folder.id, name: values.name },
			{ onSuccess: handleClose },
		);
	});

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Rename Folder</DialogTitle>
						<DialogDescription>
							Enter a new name for your folder.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="rename-folder-name">Name</Label>
							<Input
								id="rename-folder-name"
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
							onClick={handleClose}
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
