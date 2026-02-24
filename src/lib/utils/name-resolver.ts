/**
 * Resolve name conflict by appending "(1)", "(2)", etc.
 * Similar to how macOS/Windows handles duplicate file names
 * 
 * @param desiredName - The name that conflicts
 * @param existingNames - Array of existing names in the same location
 * @returns New unique name with counter appended
 * 
 * @example
 * resolveNameConflict("Document.pdf", ["Document.pdf"])
 * // Returns: "Document (1).pdf"
 * 
 * resolveNameConflict("Folder", ["Folder", "Folder (1)", "Folder (2)"])
 * // Returns: "Folder (3)"
 */
export function resolveNameConflict(
	desiredName: string,
	existingNames: string[],
): string {
	// Check for conflict case-insensitively
	const desiredNameLower = desiredName.toLowerCase();
	const existingNamesLower = existingNames.map((n) => n.toLowerCase());
	
	// If no conflict, return original name
	if (!existingNamesLower.includes(desiredNameLower)) {
		return desiredName;
	}

	// Extract base name and extension
	const { baseName, extension } = splitNameAndExtension(desiredName);

	let counter = 1;
	let newName = "";

	// Keep incrementing counter until we find available name (case-insensitive check)
	do {
		newName = extension
			? `${baseName} (${counter})${extension}`
			: `${baseName} (${counter})`;
		counter++;
	} while (existingNamesLower.includes(newName.toLowerCase()));

	return newName;
}

/**
 * Split file name into base name and extension
 * 
 * @example
 * splitNameAndExtension("document.pdf")
 * // Returns: { baseName: "document", extension: ".pdf" }
 * 
 * splitNameAndExtension("Folder")
 * // Returns: { baseName: "Folder", extension: "" }
 * 
 * splitNameAndExtension("archive.tar.gz")
 * // Returns: { baseName: "archive.tar", extension: ".gz" }
 */
export function splitNameAndExtension(name: string): {
	baseName: string;
	extension: string;
} {
	const lastDotIndex = name.lastIndexOf(".");

	// No extension or name starts with dot (hidden file)
	if (lastDotIndex === -1 || lastDotIndex === 0) {
		return {
			baseName: name,
			extension: "",
		};
	}

	return {
		baseName: name.substring(0, lastDotIndex),
		extension: name.substring(lastDotIndex),
	};
}