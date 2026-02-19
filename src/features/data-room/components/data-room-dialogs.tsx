import DeleteFile from "@/features/file/components/delete-file";
import RenameFile from "@/features/file/components/rename-file";
import DeleteFolder from "@/features/folder/components/delete-folder";
import RenameFolder from "@/features/folder/components/rename-folder";
import type { FileNode, FolderNode } from "@/types/core";

interface DataRoomDialogsProps {
	selectedFolder: FolderNode | null;
	renameOpen: boolean;
	deleteFolderOpen: boolean;
	onRenameOpenChange: (open: boolean) => void;
	onDeleteFolderOpenChange: (open: boolean) => void;
	selectedFile: FileNode | null;
	renameFileOpen: boolean;
	deleteFileOpen: boolean;
	onRenameFileOpenChange: (open: boolean) => void;
	onDeleteFileOpenChange: (open: boolean) => void;
}

// No memo — dialogs are only mounted when a selection exists
export default function DataRoomDialogs({
	selectedFolder,
	renameOpen,
	deleteFolderOpen,
	onRenameOpenChange,
	onDeleteFolderOpenChange,
	selectedFile,
	renameFileOpen,
	deleteFileOpen,
	onRenameFileOpenChange,
	onDeleteFileOpenChange,
}: DataRoomDialogsProps) {
	return (
		<>
			{selectedFolder && (
				<>
					<RenameFolder
						folder={selectedFolder}
						open={renameOpen}
						onOpenChange={onRenameOpenChange}
					/>
					<DeleteFolder
						folder={selectedFolder}
						open={deleteFolderOpen}
						onOpenChange={onDeleteFolderOpenChange}
					/>
				</>
			)}

			{selectedFile && (
				<>
					<RenameFile
						file={selectedFile}
						open={renameFileOpen}
						onOpenChange={onRenameFileOpenChange}
					/>
					<DeleteFile
						file={selectedFile}
						open={deleteFileOpen}
						onOpenChange={onDeleteFileOpenChange}
					/>
				</>
			)}
		</>
	);
}
