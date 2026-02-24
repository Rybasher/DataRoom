import { memo, useCallback, useRef, useState } from "react";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	FileTextIcon,
	FolderIcon,
	MoreVerticalIcon,
	PencilIcon,
	Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import dayjs from "@/lib/dayjs";
import { formatFileSizeCompact } from "@/lib/utils/formatters";
import type { FileNode, FileSystemNode, FolderNode } from "@/types/core";
import { isFolderNode } from "@/types/guards";
import type { SortOption } from "@/types/sort";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeListProps {
	nodes: FileSystemNode[];
	sortBy: SortOption;
	onSortChange: (option: SortOption) => void;
	onFolderClick: (id: string) => void;
	onFileClick: (file: FileNode) => void;
	onRenameClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onDeleteClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onRenameFileClick: (file: FileNode, e: React.MouseEvent) => void;
	onDeleteFileClick: (file: FileNode, e: React.MouseEvent) => void;
	onMoveNode: (nodeId: string, targetFolderId: string | null) => void;
}

const DRAG_DATA_KEY = "application/x-dataroom-node";
const DROP_TARGET_ROW_CLASS =
	"[&>td]:bg-primary/10 [&>td]:border-y [&>td]:border-primary/30";

interface DragPayload {
	id: string;
	type: "folder" | "file";
}

function getDragPayload(e: React.DragEvent): DragPayload | null {
	const rawPayload = e.dataTransfer.getData(DRAG_DATA_KEY);
	if (!rawPayload) {
		return null;
	}

	try {
		const parsed = JSON.parse(rawPayload) as DragPayload;
		if (!parsed.id || (parsed.type !== "folder" && parsed.type !== "file")) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// NodeList
// ---------------------------------------------------------------------------

function getNextSort(
	current: SortOption,
	column: "name" | "createdAt" | "updatedAt" | "size",
): SortOption {
	const asc = `${column}-asc` as SortOption;
	const desc = `${column}-desc` as SortOption;
	if (current === asc) return desc;
	if (current === desc) return null;
	return asc;
}

function SortableHead({
	label,
	column,
	sortBy,
	onSortChange,
}: {
	label: string;
	column: "name" | "createdAt" | "updatedAt" | "size";
	sortBy: SortOption;
	onSortChange: (option: SortOption) => void;
}) {
	const isActive =
		sortBy === `${column}-asc` || sortBy === `${column}-desc`;
	const isAsc = sortBy === `${column}-asc`;
	return (
		<TableHead>
			<button
				type="button"
				onClick={() => onSortChange(getNextSort(sortBy, column))}
				className="flex items-center gap-1.5 font-medium hover:text-foreground text-muted-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
			>
				{label}
				{isActive ? (
					isAsc ? (
						<ArrowUp className="h-4 w-4" />
					) : (
						<ArrowDown className="h-4 w-4" />
					)
				) : (
					<ArrowUpDown className="h-4 w-4 opacity-50" />
				)}
			</button>
		</TableHead>
	);
}

const NodeList = memo(function NodeList({
	nodes,
	sortBy,
	onSortChange,
	onFolderClick,
	onFileClick,
	onRenameClick,
	onDeleteClick,
	onRenameFileClick,
	onDeleteFileClick,
	onMoveNode,
}: NodeListProps) {
	const [dragTargetFolderId, setDragTargetFolderId] = useState<string | null>(null);
	const [isDraggingNode, setIsDraggingNode] = useState(false);
	const [isRootDragTarget, setIsRootDragTarget] = useState(false);
	const suppressClickRef = useRef(false);

	const handleNodeDragStart = useCallback((e: React.DragEvent, node: FileSystemNode) => {
		setIsDraggingNode(true);
		suppressClickRef.current = true;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", node.id);
		e.dataTransfer.setData(
			DRAG_DATA_KEY,
			JSON.stringify({
				id: node.id,
				type: node.type,
			}),
		);
	}, []);

	const handleNodeDragEnd = useCallback(() => {
		setIsDraggingNode(false);
		setDragTargetFolderId(null);
		setIsRootDragTarget(false);
		window.setTimeout(() => {
			suppressClickRef.current = false;
		}, 0);
	}, []);

	const handleFolderDragOver = useCallback(
		(e: React.DragEvent, folderId: string) => {
			const payload = getDragPayload(e);
			if (!payload || payload.id === folderId) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			e.dataTransfer.dropEffect = "move";
			setDragTargetFolderId(folderId);
			setIsRootDragTarget(false);
		},
		[],
	);

	const handleFolderDrop = useCallback(
		(e: React.DragEvent, folderId: string) => {
			e.preventDefault();
			e.stopPropagation();

			const payload = getDragPayload(e);
			setDragTargetFolderId(null);
			setIsRootDragTarget(false);

			if (!payload) {
				return;
			}

			onMoveNode(payload.id, folderId);
		},
		[onMoveNode],
	);

	const handleRootDragOver = useCallback((e: React.DragEvent) => {
		const payload = getDragPayload(e);
		if (!payload) {
			return;
		}

		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragTargetFolderId(null);
		setIsRootDragTarget(true);
	}, []);

	const handleRootDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();

			const payload = getDragPayload(e);
			setDragTargetFolderId(null);
			setIsRootDragTarget(false);

			if (!payload) {
				return;
			}

			onMoveNode(payload.id, null);
		},
		[onMoveNode],
	);

	if (nodes.length === 0) {
		return (
			<>	
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<FolderIcon className="h-16 w-16 text-muted-foreground/50" />
					<h3 className="mt-4 text-lg font-semibold">No items</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Get started by creating a folder or uploading files
					</p>
				</div>
			</>
			
		);
	}

	return (
		<div>
			<div
				className={`mb-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors ${
					isDraggingNode ? "opacity-100" : "opacity-0"
				} ${isRootDragTarget ? "border-primary/40 bg-accent/40" : "border-muted-foreground/20 bg-transparent"}`}
				onDragOver={handleRootDragOver}
				onDragLeave={() => setIsRootDragTarget(false)}
				onDrop={handleRootDrop}
			>
				Drop here to move item to root
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12" />
						<SortableHead
							label="Name"
							column="name"
							sortBy={sortBy}
							onSortChange={onSortChange}
						/>
						<SortableHead
							label="Created"
							column="createdAt"
							sortBy={sortBy}
							onSortChange={onSortChange}
						/>
						<SortableHead
							label="Modified"
							column="updatedAt"
							sortBy={sortBy}
							onSortChange={onSortChange}
						/>
						<SortableHead
							label="Size"
							column="size"
							sortBy={sortBy}
							onSortChange={onSortChange}
						/>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{nodes.map((node) =>
						isFolderNode(node) ? (
							<FolderRow
								key={node.id}
								folder={node}
								onFolderClick={onFolderClick}
								onRenameClick={onRenameClick}
								onDeleteClick={onDeleteClick}
								onNodeDragStart={handleNodeDragStart}
								onNodeDragEnd={handleNodeDragEnd}
								onFolderDragOver={handleFolderDragOver}
								onFolderDrop={handleFolderDrop}
								isDropTarget={dragTargetFolderId === node.id}
								isDraggingNode={isDraggingNode}
								suppressClickRef={suppressClickRef}
							/>
						) : (
							<FileRow
								key={node.id}
								file={node}
								onFileClick={onFileClick}
								onRenameClick={onRenameFileClick}
								onDeleteClick={onDeleteFileClick}
								onNodeDragStart={handleNodeDragStart}
								onNodeDragEnd={handleNodeDragEnd}
								suppressClickRef={suppressClickRef}
							/>
						),
					)}
				</TableBody>
			</Table>
		</div>
	);
});


export default NodeList;

// ---------------------------------------------------------------------------
// FolderRow
// ---------------------------------------------------------------------------

interface FolderRowProps {
	folder: FolderNode;
	onFolderClick: (id: string) => void;
	onRenameClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onDeleteClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onNodeDragStart: (e: React.DragEvent, node: FileSystemNode) => void;
	onNodeDragEnd: () => void;
	onFolderDragOver: (e: React.DragEvent, folderId: string) => void;
	onFolderDrop: (e: React.DragEvent, folderId: string) => void;
	isDropTarget: boolean;
	isDraggingNode: boolean;
	suppressClickRef: { current: boolean };
}

const FolderRow = memo(function FolderRow({
	folder,
	onFolderClick,
	onRenameClick,
	onDeleteClick,
	onNodeDragStart,
	onNodeDragEnd,
	onFolderDragOver,
	onFolderDrop,
	isDropTarget,
	isDraggingNode,
	suppressClickRef,
}: FolderRowProps) {
	return (
		<TableRow
			className={`cursor-pointer hover:bg-accent transition-colors ${
				isDropTarget ? DROP_TARGET_ROW_CLASS : ""
			}`}
			draggable
			onClick={() => {
				if (suppressClickRef.current) {
					return;
				}
				onFolderClick(folder.id);
			}}
			onDragStart={(e) => onNodeDragStart(e, folder)}
			onDragEnd={onNodeDragEnd}
			onDragOver={(e) => onFolderDragOver(e, folder.id)}
			onDrop={(e) => onFolderDrop(e, folder.id)}
		>
			<TableCell>
				<FolderIcon
					className={`h-5 w-5 transition-colors ${
						isDropTarget ? "text-primary" : "text-blue-500"
					}`}
				/>
			</TableCell>
			<TableCell className="font-medium">
				<div className="flex items-center gap-2">
					<div className="truncate max-w-[600px]" title={folder.name}>
						{folder.name}
					</div>
					{isDraggingNode && isDropTarget && (
						<span className="text-xs font-medium text-primary">
							Drop here
						</span>
					)}
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground">
				{dayjs(folder.createdAt).fromNow()}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{dayjs(folder.updatedAt).fromNow()}
			</TableCell>
			<TableCell className="text-muted-foreground">--</TableCell>
			<TableCell onClick={(e) => e.stopPropagation()}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVerticalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={(e) => onRenameClick(folder, e)}>
							<PencilIcon className="mr-2 h-4 w-4" />
							Rename
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							onClick={(e) => onDeleteClick(folder, e)}
						>
							<Trash2Icon className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
});

// ---------------------------------------------------------------------------
// FileRow
// ---------------------------------------------------------------------------

interface FileRowProps {
	file: FileNode;
	onFileClick: (file: FileNode) => void;
	onRenameClick: (file: FileNode, e: React.MouseEvent) => void;
	onDeleteClick: (file: FileNode, e: React.MouseEvent) => void;
	onNodeDragStart: (e: React.DragEvent, node: FileSystemNode) => void;
	onNodeDragEnd: () => void;
	suppressClickRef: { current: boolean };
}

const FileRow = memo(function FileRow({
	file,
	onFileClick,
	onRenameClick,
	onDeleteClick,
	onNodeDragStart,
	onNodeDragEnd,
	suppressClickRef,
}: FileRowProps) {
	return (
		<TableRow
			className="cursor-pointer hover:bg-accent"
			draggable
			onClick={() => {
				if (suppressClickRef.current) {
					return;
				}
				onFileClick(file);
			}}
			onDragStart={(e) => onNodeDragStart(e, file)}
			onDragEnd={onNodeDragEnd}
		>
			<TableCell>
				<FileTextIcon className="h-5 w-5 text-red-500" />
			</TableCell>
			<TableCell className="font-medium">
				<div className="truncate max-w-[600px]" title={file.name}>
					{file.name}
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground">
				{dayjs(file.createdAt).fromNow()}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{dayjs(file.updatedAt).fromNow()}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{formatFileSizeCompact(file.size)}
			</TableCell>
			<TableCell onClick={(e) => e.stopPropagation()}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVerticalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={(e) => onRenameClick(file, e)}>
							<PencilIcon className="mr-2 h-4 w-4" />
							Rename
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							onClick={(e) => onDeleteClick(file, e)}
						>
							<Trash2Icon className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
});
