import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { MAX_FILE_SIZE } from "@/constants/file-system";
import { useUploadFiles } from "@/features/file/hooks/use-upload-files";

interface Props {
	parentId: string | null;
	dataRoomId: string;
}

/**
 * Wraps react-dropzone for the data room page.
 * Click and keyboard triggers are disabled — drop only.
 */
export function useDropZone({ parentId, dataRoomId }: Props) {
	const { mutate } = useUploadFiles();

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length === 0) return;
			mutate({ files: acceptedFiles, parentId, dataRoomId });
		},
		[mutate, parentId, dataRoomId],
	);

	return useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true,
		accept: { "application/pdf": [".pdf"] },
		maxSize: MAX_FILE_SIZE,
	});
}
