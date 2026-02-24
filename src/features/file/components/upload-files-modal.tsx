import { useEffect,useRef, useState } from "react";
import { FileTextIcon, UploadCloudIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDropZoneModal } from "@/features/file/hooks/use-drop-zone-modal";
import { cn } from "@/lib/utils";

interface UploadFilesModalProps {
	parentId: string | null;
	dataRoomId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function UploadFilesModal({
	parentId,
	dataRoomId,
	open,
	onOpenChange,
}: UploadFilesModalProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		isUploading,
		handleUpload,
	} = useDropZoneModal({
		parentId,
		dataRoomId,
		onFilesSelected: (files) => {
			setSelectedFiles((prev) => [...prev, ...files]);
		},
		onUploadComplete: () => {
			setSelectedFiles([]);
			onOpenChange(false);
		},
	});

	// Reset selected files when modal closes
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (!open) setSelectedFiles([]);
	}, [open]);

	const inputProps = getInputProps();

	const handleCancel = () => {
		setSelectedFiles([]);
		onOpenChange(false);
	};

	const handleUploadClick = () => {
		if (selectedFiles.length > 0) {
			handleUpload(selectedFiles);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Upload Files</DialogTitle>
					<DialogDescription>
						Select PDF files to upload or drag and drop them here.
					</DialogDescription>
				</DialogHeader>

				<div
					{...getRootProps()}
					className={cn(
						"relative flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed transition-colors",
						isDragActive
							? isDragReject
								? "border-destructive bg-destructive/5"
								: "border-primary bg-primary/5"
							: "border-muted-foreground/25 bg-muted/10",
					)}
				>
					<input {...inputProps} ref={inputRef} />

					{/* Default state - visible when not dragging */}
					{!isDragActive && (
						<>
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
								<UploadCloudIcon className="h-10 w-10 text-muted-foreground" />
							</div>

							<div className="flex flex-col items-center gap-2 text-center">
								<p className="text-lg font-semibold">
									{selectedFiles.length > 0
										? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
										: "Drag and drop files here"}
								</p>
								<p className="text-sm text-muted-foreground">
									{selectedFiles.length > 0
										? "Add more files or click Upload to proceed"
										: "or click the button below to select files"}
								</p>
							</div>

							<Button
								type="button"
								variant="default"
								disabled={isUploading}
								onClick={(e) => {
									e.stopPropagation();
									inputRef.current?.click();
								}}
							>
								<UploadCloudIcon className="h-4 w-4" />
								Select Files
							</Button>

							<div className="flex items-center gap-1.5 rounded-full border border-muted-foreground/20 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
								<FileTextIcon className="h-3.5 w-3.5" />
								PDF only · max 50 MB
							</div>
						</>
					)}

					{/* Drag active state */}
					{isDragActive && (
						<>
							<div
								className={cn(
									"flex h-20 w-20 items-center justify-center rounded-full",
									isDragReject
										? "bg-destructive/10 text-destructive"
										: "bg-primary/10 text-primary",
								)}
							>
								{isDragReject ? (
									<XCircleIcon className="h-10 w-10" />
								) : (
									<UploadCloudIcon className="h-10 w-10" />
								)}
							</div>

							<div className="flex flex-col items-center gap-1 text-center">
								<p
									className={cn(
										"text-lg font-semibold",
										isDragReject ? "text-destructive" : "text-primary",
									)}
								>
									{isDragReject ? "Unsupported file type" : "Drop files here"}
								</p>
								<p className="text-sm text-muted-foreground">
									{isDragReject
										? "Only PDF files are accepted"
										: "Release to upload your PDF files"}
								</p>
							</div>

							{!isDragReject && (
								<div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
									<FileTextIcon className="h-3.5 w-3.5" />
									PDF only · max 50 MB
								</div>
							)}
						</>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={handleUploadClick}
						disabled={selectedFiles.length === 0 || isUploading}
						loading={isUploading}
					>
						Upload
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
