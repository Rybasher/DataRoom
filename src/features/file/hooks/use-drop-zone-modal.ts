import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { MAX_FILE_SIZE } from "@/constants/file-system";
import { useUploadFiles } from "@/features/file/hooks/use-upload-files";

interface Props {
	parentId: string | null;
	dataRoomId: string;
	onFilesSelected?: (files: File[]) => void;
	onUploadComplete?: () => void;
}

/**
 * Wraps react-dropzone for the upload files modal.
 * Click and keyboard triggers are enabled for manual file selection.
 * Files are collected but not uploaded automatically - use handleUpload to upload.
 */
export function useDropZoneModal({
	parentId,
	dataRoomId,
	onFilesSelected,
	onUploadComplete,
}: Props) {
	const { mutate, isPending } = useUploadFiles();

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length === 0) return;
			onFilesSelected?.(acceptedFiles);
		},
		[onFilesSelected],
	);

	const dropzone = useDropzone({
		onDrop,
		noClick: false,
		noKeyboard: false,
		accept: { "application/pdf": [".pdf"] },
		maxSize: MAX_FILE_SIZE,
	});

	const handleUpload = useCallback(
		(files: File[]) => {
			if (files.length === 0) return;
			mutate(
				{ files, parentId, dataRoomId },
				{
					onSuccess: () => {
						onUploadComplete?.();
					},
				},
			);
		},
		[mutate, parentId, dataRoomId, onUploadComplete],
	);

	return {
		...dropzone,
		isUploading: isPending,
		handleUpload,
	};
}
