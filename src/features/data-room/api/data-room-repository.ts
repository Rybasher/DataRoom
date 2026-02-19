import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { DatabaseError, DataRoomNotFoundError } from "@/lib/errors.ts";
import type { DataRoom } from "@/types/core";

/**
 * Get all DataRooms sorted by creation date (newest first)
 */
export async function getAllDataRooms(): Promise<DataRoom[]> {
	try {
		return await db.dataRooms
			.orderBy("createdAt")
			.reverse()
			.toArray();
	} catch (error) {
		throw new DatabaseError("Failed to fetch DataRooms", error as Error);
	}
}


/**
 * Get DataRoom by ID
 */
export async function getDataRoomById(id: string): Promise<DataRoom> {
	try {
		const dataRoom = await db.dataRooms.get(id);
		if (!dataRoom) {
			throw new DataRoomNotFoundError(id);
		}
		return dataRoom;
	} catch (error) {
		if (error instanceof DataRoomNotFoundError) {
			throw error;
		}
		throw new DatabaseError(`Failed to fetch DataRoom ${id}`, error as Error);
	}
}

/**
 * Create new DataRoom
 */
export async function createDataRoom(name: string): Promise<DataRoom> {
	try {
		const now = Date.now();
		const dataRoom: DataRoom = {
			id: uuidv4(),
			name: name.trim(),
			createdAt: now,
			updatedAt: now,
		};

		await db.dataRooms.add(dataRoom);
		return dataRoom;
	} catch (error) {
		throw new DatabaseError("Failed to create DataRoom", error as Error);
	}
}

/**
 * Update DataRoom name
 */
export async function updateDataRoom(
	id: string,
	name: string,
): Promise<DataRoom> {
	try {
		const dataRoom = await getDataRoomById(id);

		const updated: DataRoom = {
			...dataRoom,
			name: name.trim(),
			updatedAt: Date.now(),
		};

		await db.dataRooms.put(updated);
		return updated;
	} catch (error) {
		if (error instanceof DataRoomNotFoundError) {
			throw error;
		}
		throw new DatabaseError(
			`Failed to update DataRoom ${id}`,
			error as Error,
		);
	}
}

/**
 * Delete DataRoom and all its contents (nodes and blobs)
 * This is a cascade delete operation
 */
export async function deleteDataRoom(id: string): Promise<void> {
	try {
		// Get all nodes in this DataRoom
		const nodes = await db.nodes.where("dataRoomId").equals(id).toArray();

		// Delete all blobs for files in this DataRoom
		const fileNodes = nodes.filter((node) => node.type === "file");
		for (const fileNode of fileNodes) {
			if (fileNode.type === "file") {
				await db.blobs.delete(fileNode.blobKey);
			}
		}

		// Delete all nodes
		await db.nodes.where("dataRoomId").equals(id).delete();

		// Delete the DataRoom itself
		await db.dataRooms.delete(id);
	} catch (error) {
		throw new DatabaseError(
			`Failed to delete DataRoom ${id}`,
			error as Error,
		);
	}
}

/**
 * Count total nodes in DataRoom
 */
export async function countDataRoomNodes(dataRoomId: string): Promise<number> {
	try {
		return await db.nodes.where("dataRoomId").equals(dataRoomId).count();
	} catch (error) {
		throw new DatabaseError(
			`Failed to count nodes in DataRoom ${dataRoomId}`,
			error as Error,
		);
	}
}
