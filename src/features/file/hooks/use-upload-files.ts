import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadFile } from "@/features/file/api/file-repository";
import { nodeQueries } from "@/features/file-system/queries";

interface UploadFilesParams {
	files: File[];
	parentId: string | null;
	dataRoomId: string;
}

export function useUploadFiles() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ files, parentId, dataRoomId }: UploadFilesParams) => {
			// Upload all files concurrently, collect settled results
			const results = await Promise.allSettled(
				files.map((file) => uploadFile(file, parentId, dataRoomId)),
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
