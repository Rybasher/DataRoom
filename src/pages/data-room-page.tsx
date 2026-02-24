import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Trash2Icon, XIcon } from "lucide-react";
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import BulkDeleteNodes from "@/features/data-room/components/bulk-delete-nodes";
import DataRoomDialogs from "@/features/data-room/components/data-room-dialogs";
import DataRoomHeader from "@/features/data-room/components/data-room-header";
import DataRoomToolbar from "@/features/data-room/components/data-room-toolbar";
import { useDataRoom } from "@/features/data-room/hooks";
import FilePreview from "@/features/file/components/file-preview";
import NodeList from "@/features/file-system/components/node-list";
import NodeListPagination from "@/features/file-system/components/node-list-pagination";
import NodeListSkeleton from "@/features/file-system/components/node-list-skeleton";
import { useMoveNode, useNodes } from "@/features/file-system/hooks";
import { useFolderPath } from "@/features/folder/hooks";
import { pageToOffset, totalPages } from "@/lib/utils/pagination";
import type { FileNode, FolderNode } from "@/types/core";
import { SORT_OPTIONS, type SortOption } from "@/types/sort";

export default function DataRoomPage() {
	const { dataRoomId } = useParams<{ dataRoomId: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	const currentFolderId = searchParams.get("folder");

	// Folder actions
	const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null);
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);

	// File actions
	const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
	const [renameFileOpen, setRenameFileOpen] = useState(false);
	const [deleteFileOpen, setDeleteFileOpen] = useState(false);

	// File preview
	const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);

	// Bulk selection
	const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
	const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

	const [{ sortBy, page, limit }, setQueryStates] = useQueryStates({
		sortBy: parseAsStringLiteral(SORT_OPTIONS),
		page: parseAsInteger.withDefault(1),
		limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
	});

	const pagination = {
		limit,
		offset: pageToOffset(page, limit),
	};

	const { data: dataRoom } = useDataRoom(dataRoomId);
	const { mutate: moveNodeMutate } = useMoveNode();
	const { data: nodesData, isLoading } = useNodes({
		parentId: currentFolderId,
		dataRoomId: dataRoomId!,
		sortBy,
		page: pagination,
	});

	const nodes = useMemo(
		() => nodesData?.nodes ?? [],
		[nodesData],
	);
	const total = useMemo(
		() => nodesData?.total ?? 0,
		[nodesData],
	);
	const { data: breadcrumbPath = [] } = useFolderPath(currentFolderId);

	// After delete: if current page is empty and there is a previous page, go back
	useEffect(() => {
		if (nodes.length === 0 && total > 0 && page > 1) {
			void setQueryStates({ page: page - 1 });
		}
	}, [nodes.length, total, page, setQueryStates]);

	const selectedNodes = useMemo(
		() => nodes.filter((n) => selectedIds.has(n.id)),
		[nodes, selectedIds],
	);

	// Clear selection when navigating (folder or pagination page)
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedIds(new Set());
	}, [currentFolderId, page]);

	const handleToggleNode = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const handleSelectAll = useCallback((checked: boolean) => {
		if (checked) {
			setSelectedIds(new Set(nodes.map((n) => n.id)));
		} else {
			setSelectedIds(new Set());
		}
	}, [nodes]);

	const handleClearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const handleBulkDeleteClick = useCallback(() => {
		setBulkDeleteOpen(true);
	}, []);

	const handleBulkDeleted = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const handleNavigate = useCallback(
		(folderId: string | null) => {
			return folderId ? setSearchParams({ folder: folderId }) : setSearchParams({});
		},
		[setSearchParams],
	);

	const handleSortChange = useCallback(
		(option: SortOption) => {
			void setQueryStates({
				sortBy: option === sortBy ? null : option,
				page: 1,
			});
		},
		[sortBy, setQueryStates],
	);

	const handlePageChange = useCallback(
		(nextPage: number) => {
			void setQueryStates({
				page: Math.max(1, Math.min(nextPage, totalPages(total, limit))),
			});
		},
		[total, limit, setQueryStates],
	);

	const handleLimitChange = useCallback(
		(nextLimit: number) => {
			if (!PAGE_SIZE_OPTIONS.includes(nextLimit as (typeof PAGE_SIZE_OPTIONS)[number])) {
				return;
			}
			void setQueryStates({
				limit: nextLimit,
				page: 1,
			});
		},
		[setQueryStates],
	);

	const handleRenameClick = useCallback(
		(folder: FolderNode, e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedFolder(folder);
			setRenameOpen(true);
		},
		[],
	);

	const handleDeleteFolderClick = useCallback(
		(folder: FolderNode, e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedFolder(folder);
			setDeleteFolderOpen(true);
		},
		[],
	);

	const handleRenameFileClick = useCallback(
		(file: FileNode, e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedFile(file);
			setRenameFileOpen(true);
		},
		[],
	);

	const handleDeleteFileClick = useCallback(
		(file: FileNode, e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedFile(file);
			setDeleteFileOpen(true);
		},
		[],
	);

	const handleFileClick = useCallback((file: FileNode) => {
		setPreviewFile(file);
		setPreviewOpen(true);
	}, []);

	const handleMoveNode = useCallback(
		(nodeId: string, targetFolderId: string | null) => {
			moveNodeMutate({ id: nodeId, targetParentId: targetFolderId });
		},
		[moveNodeMutate],
	);

	return (
		<>
			<DataRoomHeader
				dataRoomName={dataRoom?.name ?? "Data Room"}
				breadcrumbPath={breadcrumbPath}
				onNavigate={handleNavigate}
			/>

			<DataRoomToolbar
				parentId={currentFolderId}
				dataRoomId={dataRoomId!}
				sortBy={sortBy}
				onSortChange={handleSortChange}
			/>
			<div className="flex-1 min-h-0">
				<ScrollArea className="h-full">
					<div className="p-6 space-y-3">
						{selectedIds.size > 0 && (
							<div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/50 px-4 py-2">
								<span className="text-sm font-medium">
									{selectedIds.size}{" "}
									{selectedIds.size === 1 ? "item" : "items"} selected
								</span>
								<div className="flex items-center gap-2">
									<Button
										variant="destructive"
										size="sm"
										onClick={handleBulkDeleteClick}
										className="gap-1.5"
									>
										<Trash2Icon className="h-4 w-4" />
										Delete
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleClearSelection}
										className="gap-1.5 border-primary/30 text-foreground hover:bg-muted hover:border-primary/50"
									>
										<XIcon className="h-4 w-4" />
										Clear selection
									</Button>
								</div>
							</div>
						)}
						{isLoading ? (
							<NodeListSkeleton />
						) : (
							<>
								<NodeList
									nodes={nodes}
									sortBy={sortBy}
									onSortChange={handleSortChange}
									selectedIds={selectedIds}
									onToggleNode={handleToggleNode}
									onSelectAll={handleSelectAll}
									onFolderClick={handleNavigate}
									onFileClick={handleFileClick}
									onRenameClick={handleRenameClick}
									onDeleteClick={handleDeleteFolderClick}
									onRenameFileClick={handleRenameFileClick}
									onDeleteFileClick={handleDeleteFileClick}
									onMoveNode={handleMoveNode}
								/>
								<NodeListPagination
									page={page}
									limit={limit}
									total={total}
									onPageChange={handlePageChange}
									onLimitChange={handleLimitChange}
								/>
							</>
						)}
					</div>
				</ScrollArea>
			</div>

			<DataRoomDialogs
				selectedFolder={selectedFolder}
				renameOpen={renameOpen}
				deleteFolderOpen={deleteFolderOpen}
				onRenameOpenChange={setRenameOpen}
				onDeleteFolderOpenChange={setDeleteFolderOpen}
				selectedFile={selectedFile}
				renameFileOpen={renameFileOpen}
				deleteFileOpen={deleteFileOpen}
				onRenameFileOpenChange={setRenameFileOpen}
				onDeleteFileOpenChange={setDeleteFileOpen}
			/>

			<BulkDeleteNodes
				nodes={selectedNodes}
				open={bulkDeleteOpen}
				onOpenChange={setBulkDeleteOpen}
				onDeleted={handleBulkDeleted}
			/>

			{previewOpen && previewFile && (
				<FilePreview
					file={previewFile}
					onClose={() => setPreviewOpen(false)}
				/>
			)}
		</>
	);
}
