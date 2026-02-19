import { z } from "zod";

import {
	INVALID_NAME_CHARACTERS,
	MAX_NAME_LENGTH,
	MIN_NAME_LENGTH,
} from "@/constants/file-system";

export const folderSchema = z.object({
	name: z
		.string()
		.min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} character`)
		.max(MAX_NAME_LENGTH, `Name cannot exceed ${MAX_NAME_LENGTH} characters`)
		.trim()
		.refine(
			(name) => !INVALID_NAME_CHARACTERS.some((char) => name.includes(char)),
			{
				message: `Name cannot contain: ${INVALID_NAME_CHARACTERS.join(" ")}`,
			}
		)
		.refine((name) => name.length > 0, {
			message: "Name cannot be empty",
		})
		.refine((name) => name === name.trim(), {
			message: "Name cannot start or end with whitespace",
		})
		.refine((name) => !name.endsWith(".") && !name.endsWith(" "), {
			message: "Name cannot end with a dot or space",
		}),
});

export type FolderFormData = z.infer<typeof folderSchema>;
