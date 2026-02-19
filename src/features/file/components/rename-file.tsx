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
import { useRenameFile } from "@/features/file/hooks/use-rename-file";
import { useFolderForm } from "@/features/folder/hooks";
import type { FileNode } from "@/types/core";

interface RenameFileProps {
	file: FileNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function RenameFile({ file, open, onOpenChange }: RenameFileProps) {
	// Reuse the same name validation schema used for folders
	const form = useFolderForm(file.name);
	const { mutate, isPending } = useRenameFile();

	const onSubmit = form.handleSubmit((values) => {
		mutate(
			{ id: file.id, name: values.name },
			{ onSuccess: () => onOpenChange(false) },
		);
	});

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) form.reset({ name: "" });
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Rename File</DialogTitle>
						<DialogDescription>Enter a new name for your file.</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="rename-file-name">Name</Label>
							<Input
								id="rename-file-name"
								placeholder="Enter file name"
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
