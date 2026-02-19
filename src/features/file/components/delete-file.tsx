import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteFile } from "@/features/file/hooks";
import type { FileNode } from "@/types/core";

interface DeleteFileProps {
	file: FileNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function DeleteFile({ file, open, onOpenChange }: DeleteFileProps) {
	const { mutate, isPending } = useDeleteFile();

	const handleDelete = () => {
		mutate(file.id, { onSuccess: () => onOpenChange(false) });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete File</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete &ldquo;{file.name}&rdquo;? This
						action cannot be undone.
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
