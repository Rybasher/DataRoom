import { FILE_SIZE_UNITS } from "@/constants/file-system";

/**
 * Format file size in compact form (no decimals for large sizes)
 * 
 * @example
 * formatFileSizeCompact(1024)      // "1 KB"
 * formatFileSizeCompact(1048576)   // "1 MB"
 * formatFileSizeCompact(1536)      // "1.5 KB"
 */
export function formatFileSizeCompact(bytes: number): string {
	if (bytes === 0) {
		return "0 B";
	}

	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const size = bytes / Math.pow(k, i);

	// No decimals for MB and above
	const decimals = i >= 2 ? 0 : 1;

	return `${size.toFixed(decimals)} ${FILE_SIZE_UNITS[i]}`;
}