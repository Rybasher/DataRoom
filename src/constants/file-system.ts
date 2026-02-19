// Maximum file size (50MB in bytes)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file MIME types
export const ALLOWED_MIME_TYPES = ["application/pdf"] as const;

// Reserved/invalid characters in file/folder names
export const INVALID_NAME_CHARACTERS = ["/", "\\", ":", "*", "?", '"', "<", ">", "|"];

// Maximum name length
export const MAX_NAME_LENGTH = 255;

// Minimum name length
export const MIN_NAME_LENGTH = 1;

// Reserved names (Windows)
export const RESERVED_NAMES = [
	"CON", "PRN", "AUX", "NUL",
	"COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
	"LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
] as const;

// Default DataRoom name
export const DEFAULT_DATA_ROOM_NAME = "New Data Room";

// File size units
export const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;
