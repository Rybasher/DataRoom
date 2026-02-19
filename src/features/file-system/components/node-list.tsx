import { memo } from "react";
import {
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

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeListProps {
	nodes: FileSystemNode[];
	onFolderClick: (id: string) => void;
	onFileClick: (file: FileNode) => void;
	onRenameClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onDeleteClick: (folder: FolderNode, e: React.MouseEvent) => void;
	onRenameFileClick: (file: FileNode, e: React.MouseEvent) => void;
	onDeleteFileClick: (file: FileNode, e: React.MouseEvent) => void;
}

// ---------------------------------------------------------------------------
// NodeList
// ---------------------------------------------------------------------------

const NodeList = memo(function NodeList({
	nodes,
	onFolderClick,
	onFileClick,
	onRenameClick,
	onDeleteClick,
	onRenameFileClick,
	onDeleteFileClick,
}: NodeListProps) {
	if (nodes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<FolderIcon className="h-16 w-16 text-muted-foreground/50" />
				<h3 className="mt-4 text-lg font-semibold">No items</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Get started by creating a folder or uploading files
				</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12" />
					<TableHead className="min-w-[200px]">Name</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Modified</TableHead>
					<TableHead>Size</TableHead>
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
						/>
					) : (
						<FileRow
							key={node.id}
							file={node}
							onFileClick={onFileClick}
							onRenameClick={onRenameFileClick}
							onDeleteClick={onDeleteFileClick}
						/>
					),
				)}
			</TableBody>
		</Table>
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
}

const FolderRow = memo(function FolderRow({
	folder,
	onFolderClick,
	onRenameClick,
	onDeleteClick,
}: FolderRowProps) {
	return (
		<TableRow
			className="cursor-pointer hover:bg-accent"
			onClick={() => onFolderClick(folder.id)}
		>
			<TableCell>
				<FolderIcon className="h-5 w-5 text-blue-500" />
			</TableCell>
			<TableCell className="font-medium">
				<div className="truncate max-w-[600px]" title={folder.name}>
					{folder.name}
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
}

const FileRow = memo(function FileRow({ file, onFileClick, onRenameClick, onDeleteClick }: FileRowProps) {
	return (
		<TableRow className="cursor-pointer hover:bg-accent" onClick={() => onFileClick(file)}>
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
