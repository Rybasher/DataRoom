import {
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE,
} from "@/constants/file-system";
import {
	FileSizeExceededError,
	InvalidFileTypeError,
} from "@/lib/errors.ts";

/**
 * Validate if file type is allowed
 */
export function isFileTypeAllowed(mimeType: string): boolean {
	return ALLOWED_MIME_TYPES.includes(mimeType as any);
}

/**
 * Validate if file size is within limit
 */
export function isFileSizeValid(size: number): boolean {
	return size > 0 && size <= MAX_FILE_SIZE;
}

/**
 * Validate file and throw appropriate errors
 * 
 * @throws {InvalidFileTypeError} If file type is not allowed
 * @throws {FileSizeExceededError} If file size exceeds limit
 */
export function validateFile(file: File): void {
	// Check file type
	if (!isFileTypeAllowed(file.type)) {
		throw new InvalidFileTypeError(file.name, file.type);
	}

	// Check file size
	if (!isFileSizeValid(file.size)) {
		throw new FileSizeExceededError(file.name, file.size, MAX_FILE_SIZE);
	}
}

/**
 * Validate multiple files and return validation results
 * Returns array of errors for invalid files
 */
export function validateFiles(files: File[]): {
	valid: File[];
	invalid: Array<{ file: File; error: Error }>;
} {
	const valid: File[] = [];
	const invalid: Array<{ file: File; error: Error }> = [];

	for (const file of files) {
		try {
			validateFile(file);
			valid.push(file);
		} catch (error) {
			invalid.push({ file, error: error as Error });
		}
	}

	return { valid, invalid };
}

/**
 * Check if file is a PDF
 */
export function isPDF(file: File): boolean {
	return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
	const lastDotIndex = fileName.lastIndexOf(".");
	if (lastDotIndex === -1 || lastDotIndex === 0) {
		return "";
	}
	return fileName.substring(lastDotIndex).toLowerCase();
}

/**
 * Check if file extension matches MIME type
 */
export function isExtensionValid(fileName: string, mimeType: string): boolean {
	const extension = getFileExtension(fileName);

	const mimeToExtension: Record<string, string> = {
		"application/pdf": ".pdf",
	};

	return mimeToExtension[mimeType] === extension;
}
