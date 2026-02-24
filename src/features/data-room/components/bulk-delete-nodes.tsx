import { FileTextIcon, FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteNodes } from "@/features/file-system/hooks";
import type { FileSystemNode } from "@/types/core";
import { isFolderNode } from "@/types/guards";

interface BulkDeleteNodesProps {
	nodes: FileSystemNode[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Called after the nodes are successfully deleted (e.g. clear selection) */
	onDeleted?: () => void;
}

const MAX_NAMES_PREVIEW = 5;

export default function BulkDeleteNodes({
	nodes,
	open,
	onOpenChange,
	onDeleted,
}: BulkDeleteNodesProps) {
	const { mutate, isPending } = useDeleteNodes();

	const handleDelete = () => {
		const ids = nodes.map((n) => n.id);
		mutate(ids, {
			onSuccess: () => {
				onOpenChange(false);
				onDeleted?.();
			},
		});
	};

	const count = nodes.length;
	const preview = nodes.slice(0, MAX_NAMES_PREVIEW);
	const hasMore = count > MAX_NAMES_PREVIEW;
	const canDelete = count > 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] flex flex-col max-w-md">
				<DialogHeader>
					<DialogTitle>
						{count === 1 ? "Delete item" : `Delete ${count} items`}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{count === 1
							? "Are you sure you want to delete this item? This action cannot be undone."
							: `Are you sure you want to delete ${count} items? This action cannot be undone.`}
					</DialogDescription>
				</DialogHeader>

				<p className="text-sm text-muted-foreground">
					{count === 1
						? "This action cannot be undone. Files will be permanently deleted; folders and all their contents will be removed."
						: `The following ${count} items will be permanently deleted. This action cannot be undone.`}
				</p>

				<div className="flex-1 min-h-0 overflow-y-auto rounded-md border bg-muted/30 p-3">
					<ul className="space-y-1.5 text-sm">
						{preview.map((node) => (
							<li
								key={node.id}
								className="flex items-center gap-2 truncate"
								title={node.name}
							>
								{isFolderNode(node) ? (
									<FolderIcon className="h-4 w-4 shrink-0 text-blue-500" />
								) : (
									<FileTextIcon className="h-4 w-4 shrink-0 text-red-500" />
								)}
								<span className="truncate">{node.name}</span>
							</li>
						))}
						{hasMore && (
							<li className="text-muted-foreground pl-6">
								… and {count - MAX_NAMES_PREVIEW} more
							</li>
						)}
					</ul>
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
						type="button"
						variant="destructive"
						onClick={handleDelete}
						loading={isPending}
						disabled={!canDelete}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
