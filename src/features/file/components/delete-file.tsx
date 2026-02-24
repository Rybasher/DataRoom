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
					<DialogDescription className="overflow-hidden">
                        Are you sure you want to delete this file? This action cannot be undone.
						<span className="font-medium truncate block" title={file.name}>
                            &ldquo;{file.name}&rdquo;
						</span>
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
