import {
	createFolder as createFolderNode,
	deleteNodeRecursive,
	getChildren,
	getNodePath,
	renameNode,
} from "@/features/file-system/api/node-repository";
import type { FolderNode } from "@/types/core";
import type {SortOption} from "@/types/sort.ts";

export async function getFolders(
	parentId: string | null,
	dataRoomId: string,
	sortBy?: SortOption | null,
): Promise<FolderNode[]> {
	const nodes = await getChildren(parentId, dataRoomId, sortBy);
	return nodes.filter((node) => node.type === "folder");
}

export async function createFolder(
	name: string,
	parentId: string | null,
	dataRoomId: string,
): Promise<FolderNode> {
	return await createFolderNode(name, parentId, dataRoomId);
}

export async function renameFolder(
	id: string,
	newName: string,
): Promise<FolderNode> {
	const updated = await renameNode(id, newName);
	return updated as FolderNode;
}

export async function deleteFolder(id: string): Promise<void> {
	await deleteNodeRecursive(id);
}

export async function getFolderPath(
	folderId: string | null,
): Promise<FolderNode[]> {
	return await getNodePath(folderId);
}
