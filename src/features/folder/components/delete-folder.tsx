
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteFolder } from "@/features/folder/hooks";
import type { FolderNode } from "@/types/core";

interface DeleteFolderProps {
	folder: FolderNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function DeleteFolder({
	folder,
	open,
	onOpenChange,
}: DeleteFolderProps) {
	const { mutate, isPending } = useDeleteFolder();

	const handleDelete = () => {
		mutate(folder.id, { onSuccess: () => onOpenChange(false) });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Folder</DialogTitle>
					<DialogDescription>
							Are you sure you want to delete &ldquo;{folder.name}&rdquo;? This
							action cannot be undone and will delete all files and folders inside
							this folder.
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
