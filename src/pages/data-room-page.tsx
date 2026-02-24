import { useCallback, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { ScrollArea } from "@/components/ui/scroll-area";
import DataRoomDialogs from "@/features/data-room/components/data-room-dialogs";
import DataRoomHeader from "@/features/data-room/components/data-room-header";
import DataRoomToolbar from "@/features/data-room/components/data-room-toolbar";
import { useDataRoom } from "@/features/data-room/hooks";
import FileDropZone from "@/features/file/components/file-drop-zone";
import FilePreview from "@/features/file/components/file-preview";
import NodeList from "@/features/file-system/components/node-list";
import NodeListSkeleton from "@/features/file-system/components/node-list-skeleton";
import { useMoveNode, useNodes } from "@/features/file-system/hooks";
import { useFolderPath } from "@/features/folder/hooks";
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

	const [sortBy, setSortBy] = useQueryState(
		"sortBy",
		parseAsStringLiteral(SORT_OPTIONS),
	);

	const { data: dataRoom } = useDataRoom(dataRoomId);
	const { mutate: moveNodeMutate } = useMoveNode();
	const { data: nodes = [], isLoading } = useNodes({
		parentId: currentFolderId,
		dataRoomId: dataRoomId!,
		sortBy,
	});
	const { data: breadcrumbPath = [] } = useFolderPath(currentFolderId);

	const handleNavigate = useCallback(
		(folderId: string | null) => {
			return folderId ? setSearchParams({ folder: folderId }) : setSearchParams({});
		},
		[setSearchParams],
	);

	const handleSortChange = useCallback(
		async (option: SortOption) => {
			await setSortBy(option === sortBy ? null : option);
		},
		[sortBy, setSortBy],
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
			<FileDropZone
				parentId={currentFolderId}
				dataRoomId={dataRoomId!}
				className="flex-1 min-h-0"
			>
				<ScrollArea className="h-full">
					<div className="p-6">
						{isLoading ? (
							<NodeListSkeleton />
						) : (
							<NodeList
								nodes={nodes}
								sortBy={sortBy}
								onSortChange={handleSortChange}
								onFolderClick={handleNavigate}
								onFileClick={handleFileClick}
								onRenameClick={handleRenameClick}
								onDeleteClick={handleDeleteFolderClick}
								onRenameFileClick={handleRenameFileClick}
								onDeleteFileClick={handleDeleteFileClick}
								onMoveNode={handleMoveNode}
							/>
						)}
					</div>
				</ScrollArea>
			</FileDropZone>

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

			{previewOpen && previewFile && (
				<FilePreview
					file={previewFile}
					onClose={() => setPreviewOpen(false)}
				/>
			)}
		</>
	);
}
