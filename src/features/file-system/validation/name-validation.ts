import {
	INVALID_NAME_CHARACTERS,
	MAX_NAME_LENGTH,
	MIN_NAME_LENGTH,
	RESERVED_NAMES,
} from "@/constants/file-system";
import { InvalidNameError } from "@/lib/errors.ts";

/**
 * Check if name contains invalid characters
 */
export function hasInvalidCharacters(name: string): boolean {
	return INVALID_NAME_CHARACTERS.some((char) => name.includes(char));
}

/**
 * Check if name is a reserved system name
 */
export function isReservedName(name: string): boolean {
	const upperName = name.toUpperCase();
	return RESERVED_NAMES.includes(upperName as any);
}

/**
 * Check if name length is valid
 */
export function isNameLengthValid(name: string): boolean {
	const trimmed = name.trim();
	return (
		trimmed.length >= MIN_NAME_LENGTH && trimmed.length <= MAX_NAME_LENGTH
	);
}

/**
 * Check if name starts or ends with whitespace
 */
export function hasLeadingOrTrailingWhitespace(name: string): boolean {
	return name !== name.trim();
}

/**
 * Check if name ends with dot or space (invalid on Windows)
 */
export function endsWithDotOrSpace(name: string): boolean {
	return name.endsWith(".") || name.endsWith(" ");
}

/**
 * Check if name is empty or only whitespace
 */
export function isEmpty(name: string): boolean {
	return name.trim().length === 0;
}

/**
 * Validate name and return error message if invalid
 * Returns null if valid
 */
export function validateNameWithMessage(name: string): string | null {
	// Check if empty
	if (isEmpty(name)) {
		return "Name cannot be empty";
	}

	// Check length
	if (!isNameLengthValid(name)) {
		if (name.trim().length < MIN_NAME_LENGTH) {
			return `Name must be at least ${MIN_NAME_LENGTH} character`;
		}
		return `Name cannot exceed ${MAX_NAME_LENGTH} characters`;
	}

	// Check invalid characters
	if (hasInvalidCharacters(name)) {
		const invalidChars = INVALID_NAME_CHARACTERS.join(" ");
		return `Name cannot contain: ${invalidChars}`;
	}

	// Check reserved names
	if (isReservedName(name)) {
		return `"${name}" is a reserved system name`;
	}

	// Check leading/trailing whitespace
	if (hasLeadingOrTrailingWhitespace(name)) {
		return "Name cannot start or end with whitespace";
	}

	// Check ending with dot or space
	if (endsWithDotOrSpace(name)) {
		return "Name cannot end with a dot or space";
	}

	return null;
}

/**
 * Validate name and throw error if invalid
 * 
 * @throws {InvalidNameError} If name is invalid
 */
export function validateName(name: string): void {
	const error = validateNameWithMessage(name);
	if (error) {
		throw new InvalidNameError(name, error);
	}
}

/**
 * Sanitize name by removing invalid characters
 * Returns a valid name or throws if cannot be sanitized
 */
export function sanitizeName(name: string): string {
	let sanitized = name.trim();

	// Replace invalid characters with underscore
	for (const char of INVALID_NAME_CHARACTERS) {
		sanitized = sanitized.replace(new RegExp(`\\${char}`, "g"), "_");
	}

	// Remove trailing dots and spaces
	sanitized = sanitized.replace(/[.\s]+$/, "");

	// Check if result is valid
	if (isEmpty(sanitized)) {
		throw new InvalidNameError(name, "Cannot sanitize to valid name");
	}

	// Check reserved names
	if (isReservedName(sanitized)) {
		sanitized = `_${sanitized}`;
	}

	// Truncate if too long
	if (sanitized.length > MAX_NAME_LENGTH) {
		sanitized = sanitized.substring(0, MAX_NAME_LENGTH);
	}

	return sanitized;
}

/**
 * Check if name is valid (boolean check without throwing)
 */
export function isNameValid(name: string): boolean {
	return validateNameWithMessage(name) === null;
}

/**
 * Get list of invalid characters found in name
 */
export function getInvalidCharacters(name: string): string[] {
	return INVALID_NAME_CHARACTERS.filter((char) => name.includes(char));
}
