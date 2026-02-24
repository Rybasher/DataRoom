import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import {
	DatabaseError,
	DuplicateNameError,
	NodeNotFoundError,
	ValidationError,
} from "@/lib/errors.ts";
import type { FileNode, FileSystemNode, FolderNode } from "@/types/core";
import type { SortOption } from "@/types/sort.ts";

export async function getChildren(
	parentId: string | null,
	dataRoomId: string,
	sortBy?: SortOption | null,
): Promise<FileSystemNode[]> {
	try {
		let nodes: FileSystemNode[];
		if (parentId === null) {
			// For root level, get all nodes where parentId is null
			const allNodes = await db.nodes
				.where({ dataRoomId })
				.toArray();
			nodes = allNodes.filter((node) => node.parentId === null);
		} else {
			// For specific folder, use compound index
			nodes = await db.nodes
				.where({ parentId, dataRoomId })
				.toArray();
		}

		switch (sortBy) {
			case "createdAt-asc":
				return nodes.sort((a, b) => a.createdAt - b.createdAt);
			case "createdAt-desc":
				return nodes.sort((a, b) => b.createdAt - a.createdAt);
			case "updatedAt-asc":
				return nodes.sort((a, b) => a.updatedAt - b.updatedAt);
			case "updatedAt-desc":
				return nodes.sort((a, b) => b.updatedAt - a.updatedAt);
			default:
				return nodes.sort((a, b) => a.createdAt - b.createdAt);
		}
	} catch (error) {
		throw new DatabaseError(
			`Failed to fetch children of ${parentId ?? "root"}`,
			error as Error,
		);
	}
}

/**
 * Get node by ID
 */
export async function getNodeById(id: string): Promise<FileSystemNode> {
	try {
		const node = await db.nodes.get(id);
		if (!node) {
			throw new NodeNotFoundError(id);
		}
		return node;
	} catch (error) {
		if (error instanceof NodeNotFoundError) {
			throw error;
		}
		throw new DatabaseError(`Failed to fetch node ${id}`, error as Error);
	}
}

/**
 * Check if a name already exists in the parent folder (case-insensitive)
 */
export async function checkNameExists(
	name: string,
	parentId: string | null,
	dataRoomId: string,
	excludeId?: string,
): Promise<boolean> {
	try {
		const children = await getChildren(parentId, dataRoomId);
		const nameLower = name.toLowerCase();
		return children.some(
			(node) => node.name.toLowerCase() === nameLower && node.id !== excludeId,
		);
	} catch (error) {
		throw new DatabaseError("Failed to check name existence", error as Error);
	}
}

/**
 * Create a new folder
 */
export async function createFolder(
	name: string,
	parentId: string | null,
	dataRoomId: string,
): Promise<FolderNode> {
	try {
		// Check for duplicate names
		const exists = await checkNameExists(name, parentId, dataRoomId);
		if (exists) {
			throw new DuplicateNameError(name);
		}

		const now = Date.now();
		const folder: FolderNode = {
			id: uuidv4(),
			name: name.trim(),
			parentId,
			dataRoomId,
			type: "folder",
			createdAt: now,
			updatedAt: now,
		};

		await db.nodes.add(folder);
		return folder;
	} catch (error) {
		if (
			error instanceof DuplicateNameError ||
			error instanceof DatabaseError
		) {
			throw error;
		}
		throw new DatabaseError("Failed to create folder", error as Error);
	}
}

/**
 * Create a new file node (metadata only, blob stored separately)
 */
export async function createFile(
	name: string,
	parentId: string | null,
	dataRoomId: string,
	mimeType: string,
	size: number,
	blobKey: string,
): Promise<FileNode> {
	try {
		// Check for duplicate names
		const exists = await checkNameExists(name, parentId, dataRoomId);
		if (exists) {
			throw new DuplicateNameError(name);
		}

		const now = Date.now();
		const file: FileNode = {
			id: uuidv4(),
			name: name.trim(),
			parentId,
			dataRoomId,
			type: "file",
			mimeType,
			size,
			blobKey,
			createdAt: now,
			updatedAt: now,
		};

		await db.nodes.add(file);
		return file;
	} catch (error) {
		if (
			error instanceof DuplicateNameError ||
			error instanceof DatabaseError
		) {
			throw error;
		}
		throw new DatabaseError("Failed to create file", error as Error);
	}
}

/**
 * Rename a node
 */
export async function renameNode(
	id: string,
	newName: string,
): Promise<FileSystemNode> {
	try {
		const node = await getNodeById(id);

		// Check for duplicate names (excluding current node)
		const exists = await checkNameExists(
			newName,
			node.parentId,
			node.dataRoomId,
			id,
		);
		if (exists) {
			throw new DuplicateNameError(newName);
		}

		const updated: FileSystemNode = {
			...node,
			name: newName.trim(),
			updatedAt: Date.now(),
		};

		await db.nodes.put(updated);
		return updated;
	} catch (error) {
		if (
			error instanceof NodeNotFoundError ||
			error instanceof DuplicateNameError
		) {
			throw error;
		}
		throw new DatabaseError(`Failed to rename node ${id}`, error as Error);
	}
}

/**
 * Check whether candidate node is inside ancestor subtree.
 */
async function isNodeDescendant(
	candidateNodeId: string,
	ancestorNodeId: string,
): Promise<boolean> {
	let currentId: string | null = candidateNodeId;

	while (currentId !== null) {
		if (currentId === ancestorNodeId) {
			return true;
		}

		const currentNode = await getNodeById(currentId);
		currentId = currentNode.parentId;
	}

	return false;
}

/**
 * Move a node to another folder (or root when targetParentId is null)
 */
export async function moveNode(
	id: string,
	targetParentId: string | null,
): Promise<FileSystemNode> {
	try {
		const node = await getNodeById(id);

		if (targetParentId === id) {
			throw new ValidationError("Cannot move a node into itself");
		}

		if (targetParentId !== null) {
			const targetParent = await getNodeById(targetParentId);
			if (targetParent.type !== "folder") {
				throw new ValidationError("Target location must be a folder");
			}

			if (targetParent.dataRoomId !== node.dataRoomId) {
				throw new ValidationError("Cannot move nodes across DataRooms");
			}
		}

		if (node.parentId === targetParentId) {
			return node;
		}

		if (node.type === "folder" && targetParentId !== null) {
			const movingIntoDescendant = await isNodeDescendant(targetParentId, node.id);
			if (movingIntoDescendant) {
				throw new ValidationError("Cannot move a folder into its own descendant");
			}
		}

		const exists = await checkNameExists(
			node.name,
			targetParentId,
			node.dataRoomId,
			node.id,
		);
		if (exists) {
			throw new DuplicateNameError(node.name);
		}

		const updatedNode: FileSystemNode = {
			...node,
			parentId: targetParentId,
			updatedAt: Date.now(),
		};

		await db.nodes.put(updatedNode);
		return updatedNode;
	} catch (error) {
		if (
			error instanceof NodeNotFoundError ||
			error instanceof DuplicateNameError ||
			error instanceof ValidationError
		) {
			throw error;
		}
		throw new DatabaseError(`Failed to move node ${id}`, error as Error);
	}
}

/**
 * Recursively delete a node and all its children (cascade delete)
 */
export async function deleteNodeRecursive(nodeId: string): Promise<void> {
	try {
		const node = await getNodeById(nodeId);

		// If it's a folder, recursively delete all children first
		if (node.type === "folder") {
			const children = await db.nodes
				.where("parentId")
				.equals(nodeId)
				.toArray();

			for (const child of children) {
				await deleteNodeRecursive(child.id);
			}
		}

		// If it's a file, delete the blob
		if (node.type === "file") {
			await db.blobs.delete(node.blobKey);
		}

		// Delete the node itself
		await db.nodes.delete(nodeId);
	} catch (error) {
		if (error instanceof NodeNotFoundError) {
			throw error;
		}
		throw new DatabaseError(
			`Failed to delete node ${nodeId}`,
			error as Error,
		);
	}
}

/**
 * Delete multiple nodes
 */
export async function deleteNodes(nodeIds: string[]): Promise<void> {
	try {
		for (const nodeId of nodeIds) {
			await deleteNodeRecursive(nodeId);
		}
	} catch (error) {
		throw new DatabaseError("Failed to delete nodes", error as Error);
	}
}

/**
 * Count total children (recursive) for a folder
 */
export async function countChildren(
	nodeId: string,
): Promise<{ files: number; folders: number; total: number }> {
	try {
		let files = 0;
		let folders = 0;

		const children = await db.nodes.where("parentId").equals(nodeId).toArray();

		for (const child of children) {
			if (child.type === "file") {
				files++;
			} else {
				folders++;
				const subCount = await countChildren(child.id);
				files += subCount.files;
				folders += subCount.folders;
			}
		}

		return { files, folders, total: files + folders };
	} catch (error) {
		throw new DatabaseError(
			`Failed to count children of ${nodeId}`,
			error as Error,
		);
	}
}

/**
 * Get path to node (breadcrumbs)
 */
export async function getNodePath(nodeId: string | null): Promise<FolderNode[]> {
	try {
		const path: FolderNode[] = [];

		if (nodeId === null) {
			return path;
		}

		let currentId: string | null = nodeId;

		while (currentId !== null) {
			const node = await getNodeById(currentId);

			// Only add folders to path
			if (node.type === "folder") {
				path.unshift(node);
			}

			currentId = node.parentId;
		}

		return path;
	} catch (error) {
		throw new DatabaseError(
			`Failed to get path for node ${nodeId}`,
			error as Error,
		);
	}
}
