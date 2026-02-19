export class DataRoomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DataRoomError";
	}
}

export class ValidationError extends DataRoomError {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export class DuplicateNameError extends ValidationError {
	constructor(name: string) {
		super(`A file or folder named "${name}" already exists in this location`);
		this.name = "DuplicateNameError";
	}
}

export class InvalidFileTypeError extends ValidationError {
	constructor(fileName: string, mimeType: string) {
		super(`File "${fileName}" has invalid type "${mimeType}". Only PDF files are allowed.`);
		this.name = "InvalidFileTypeError";
	}
}

export class FileSizeExceededError extends ValidationError {
	constructor(fileName: string, size: number, maxSize: number) {
		super(`File "${fileName}" size (${size} bytes) exceeds maximum allowed size (${maxSize} bytes)`);
		this.name = "FileSizeExceededError";
	}
}

export class InvalidNameError extends ValidationError {
	constructor(name: string, reason: string) {
		super(`Invalid name "${name}": ${reason}`);
		this.name = "InvalidNameError";
	}
}

export class NodeNotFoundError extends DataRoomError {
	constructor(nodeId: string) {
		super(`Node with id "${nodeId}" not found`);
		this.name = "NodeNotFoundError";
	}
}

export class DataRoomNotFoundError extends DataRoomError {
	constructor(dataRoomId: string) {
		super(`DataRoom with id "${dataRoomId}" not found`);
		this.name = "DataRoomNotFoundError";
	}
}

export class DatabaseError extends DataRoomError {
	constructor(message: string, cause?: Error) {
		super(`Database error: ${message}`);
		this.name = "DatabaseError";
		if (cause) {
			this.cause = cause;
		}
	}
}

export class BlobNotFoundError extends DatabaseError {
	constructor(blobKey: string) {
		super(`Blob with key "${blobKey}" not found`);
		this.name = "BlobNotFoundError";
	}
}
