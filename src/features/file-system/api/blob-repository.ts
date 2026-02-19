import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { BlobNotFoundError, DatabaseError } from "@/lib/errors.ts";

/**
 * Store a file blob in IndexedDB
 * Returns the key (UUID) for the stored blob
 */
export async function storeBlob(blob: Blob): Promise<string> {
	try {
		const key = uuidv4();

		await db.blobs.add({
			key,
			data: blob,
		});

		return key;
	} catch (error) {
		throw new DatabaseError("Failed to store blob", error as Error);
	}
}

/**
 * Retrieve a blob by its key
 */
export async function getBlob(key: string): Promise<Blob> {
	try {
		const record = await db.blobs.get(key);

		if (!record) {
			throw new BlobNotFoundError(key);
		}

		return record.data;
	} catch (error) {
		if (error instanceof BlobNotFoundError) {
			throw error;
		}
		throw new DatabaseError(`Failed to retrieve blob ${key}`, error as Error);
	}
}

/**
 * Delete a blob by its key
 */
export async function deleteBlob(key: string): Promise<void> {
	try {
		await db.blobs.delete(key);
	} catch (error) {
		throw new DatabaseError(`Failed to delete blob ${key}`, error as Error);
	}
}

/**
 * Check if a blob exists
 */
export async function blobExists(key: string): Promise<boolean> {
	try {
		const record = await db.blobs.get(key);
		return record !== undefined;
	} catch (error) {
		throw new DatabaseError(
			`Failed to check blob existence ${key}`,
			error as Error,
		);
	}
}

/**
 * Get blob as Data URL (for preview/download)
 */
export async function getBlobAsDataUrl(key: string): Promise<string> {
	try {
		const blob = await getBlob(key);

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		throw new DatabaseError(
			`Failed to convert blob to data URL ${key}`,
			error as Error,
		);
	}
}

/**
 * Get blob as ArrayBuffer (for processing)
 */
export async function getBlobAsArrayBuffer(key: string): Promise<ArrayBuffer> {
	try {
		const blob = await getBlob(key);

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = reject;
			reader.readAsArrayBuffer(blob);
		});
	} catch (error) {
		throw new DatabaseError(
			`Failed to convert blob to array buffer ${key}`,
			error as Error,
		);
	}
}

/**
 * Get total size of all blobs in storage
 */
export async function getTotalBlobSize(): Promise<number> {
	try {
		const blobs = await db.blobs.toArray();
		return blobs.reduce((total, record) => total + record.data.size, 0);
	} catch (error) {
		throw new DatabaseError(
			"Failed to calculate total blob size",
			error as Error,
		);
	}
}
