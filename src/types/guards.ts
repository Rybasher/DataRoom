import type { FileNode, FileSystemNode, FolderNode } from "@/types/core";

export function isFolderNode(node: FileSystemNode): node is FolderNode {
	return node.type === "folder";
}

export function isFileNode(node: FileSystemNode): node is FileNode {
	return node.type === "file";
}
