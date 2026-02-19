import Dexie, { type EntityTable } from "dexie";

import type { DataRoom, FileSystemNode } from "@/types/core";

// Blob storage interface
export interface BlobRecord {
	key: string;
	data: Blob;
}

// Extend Dexie with our tables
export class DataRoomDB extends Dexie {
	// Define tables with proper typing
	dataRooms!: EntityTable<DataRoom, "id">;
	nodes!: EntityTable<FileSystemNode, "id">;
	blobs!: EntityTable<BlobRecord, "key">;

	constructor() {
		super("DataRoomDB");

		// Define schema version 1
		this.version(1).stores({
			dataRooms: "id, name, createdAt",
			nodes: "id, parentId, dataRoomId, [parentId+dataRoomId], type, name, createdAt",
			blobs: "key",
		});
	}
}

// Create and export database instance
export const db = new DataRoomDB();

// Helper to initialize database (optional, useful for migrations)
export async function initDatabase(): Promise<void> {
	try {
		await db.open();
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
}

// Helper to clear all data (useful for development/testing)
export async function clearDatabase(): Promise<void> {
	await db.dataRooms.clear();
	await db.nodes.clear();
	await db.blobs.clear();
	console.log("Database cleared");
}
