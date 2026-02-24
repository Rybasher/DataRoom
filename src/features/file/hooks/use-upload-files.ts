import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadFileWithName } from "@/features/file/api/file-repository";
import { getChildren } from "@/features/file-system/api/node-repository";
import { nodeQueries } from "@/features/file-system/queries";
import { resolveNameConflict } from "@/lib/utils/name-resolver";

interface UploadFilesParams {
	files: File[];
	parentId: string | null;
	dataRoomId: string;
}

export function useUploadFiles() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ files, parentId, dataRoomId }: UploadFilesParams) => {
			// Get existing files once before resolving conflicts
			const { nodes: siblings } = await getChildren(parentId, dataRoomId);
			const existingNames = siblings.map((n) => n.name);

			// Resolve name conflicts for all files, considering both existing files
			// and other files in the batch
			const resolvedNames: string[] = [];
			const filesWithNames = files.map((file) => {
				// Combine existing names and already resolved names from this batch
				const allExistingNames = [...existingNames, ...resolvedNames];
				const resolvedName = resolveNameConflict(file.name, allExistingNames);
				resolvedNames.push(resolvedName);
				return { file, resolvedName };
			});

			// Upload all files concurrently with pre-resolved names
			const results = await Promise.allSettled(
				filesWithNames.map(({ file, resolvedName }) =>
					uploadFileWithName(file, resolvedName, parentId, dataRoomId),
				),
			);

			// Single invalidation — nodes table covers both folders and files
			await queryClient.invalidateQueries({ queryKey: nodeQueries.key });

			return { results, files };
		},
		onSuccess: ({ results, files }) => {
			const succeeded = results.filter((r) => r.status === "fulfilled").length;
			const failed = results.filter(
				(r): r is PromiseRejectedResult => r.status === "rejected",
			);

			if (succeeded > 0) {
				toast.success(
					succeeded === 1
						? `"${files[0].name}" uploaded successfully`
						: `${succeeded} files uploaded successfully`,
				);
			}

			// Show individual error toast for each failed file
			failed.forEach((r) => {
				toast.error("Upload failed", {
					description: r.reason?.message ?? "Unknown error",
				});
			});
		},
		onError: (error: Error) => {
			toast.error("Upload failed", { description: error.message });
		},
	});
}
