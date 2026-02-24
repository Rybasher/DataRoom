import { storeBlob } from "@/features/file-system/api/blob-repository";
import {
	createFile,
	deleteNodeRecursive,
	getChildren,
	renameNode,
} from "@/features/file-system/api/node-repository";
import { validateFile } from "@/features/file-system/validation/file-validation";
import { DatabaseError } from "@/lib/errors";
import { resolveNameConflict } from "@/lib/utils/name-resolver";
import type { FileNode } from "@/types/core";
import type { SortOption } from "@/types/sort";

/**
 * Upload a single file: validate → resolve unique name → store blob → create node.
 * If a file with the same name already exists, the name gets an OS-style suffix:
 * "report.pdf" → "report (1).pdf" → "report (2).pdf", etc.
 */
export async function uploadFile(
	file: File,
	parentId: string | null,
	dataRoomId: string,
): Promise<FileNode> {
	// Throws InvalidFileTypeError or FileSizeExceededError if invalid
	validateFile(file);

	// Single DB call to get all siblings, then resolve name conflict client-side
	const { nodes: siblings } = await getChildren(parentId, dataRoomId);
	const existingNames = siblings.map((n) => n.name);
	const name = resolveNameConflict(file.name, existingNames);

	const blobKey = await storeBlob(file);

	try {
		return await createFile(name, parentId, dataRoomId, file.type, file.size, blobKey);
	} catch (error) {
		// If node creation fails, clean up the orphaned blob
		try {
			const { deleteBlob } = await import(
				"@/features/file-system/api/blob-repository"
			);
			await deleteBlob(blobKey);
		} catch {
			// Ignore cleanup errors
		}
		throw error;
	}
}

/**
 * Rename a file node. Enforces unique name within the same parent folder.
 */
export async function renameFile(id: string, newName: string): Promise<FileNode> {
	const updated = await renameNode(id, newName);
	return updated as FileNode;
}

/**
 * Delete a file node and its associated blob from storage.
 * Blob cleanup is handled inside deleteNodeRecursive.
 */
export async function deleteFile(id: string): Promise<void> {
	await deleteNodeRecursive(id);
}

/**
 * Get all file nodes for a given parent location
 */
export async function getFiles(
	parentId: string | null,
	dataRoomId: string,
	sortBy?: SortOption | null,
): Promise<FileNode[]> {
	try {
		const { nodes } = await getChildren(parentId, dataRoomId, sortBy);
		return nodes.filter((node): node is FileNode => node.type === "file");
	} catch (error) {
		throw new DatabaseError("Failed to fetch files", error as Error);
	}
}
