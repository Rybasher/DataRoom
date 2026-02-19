import type { ReactNode } from "react";
import { FileTextIcon, UploadCloudIcon, XCircleIcon } from "lucide-react";

import { useDropZone } from "@/features/file/hooks/use-drop-zone";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
	parentId: string | null;
	dataRoomId: string;
	className?: string;
	children: ReactNode;
}

export default function FileDropZone({
	parentId,
	dataRoomId,
	className,
	children,
}: FileDropZoneProps) {
	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropZone({
		parentId,
		dataRoomId,
	});

	return (
		<div
			{...getRootProps()}
			className={cn("relative", className)}
		>
			{/* Hidden input required by react-dropzone even with noClick */}
			<input {...getInputProps()} />

			{children}

			{/* Drag overlay — only rendered while a drag is in progress */}
			{isDragActive && (
				<div
					className={cn(
						"absolute inset-0 z-20 flex flex-col items-center justify-center gap-4",
						"backdrop-blur-sm transition-all duration-200",
						isDragReject
							? "bg-destructive/10 border-2 border-dashed border-destructive"
							: "bg-primary/5 border-2 border-dashed border-primary",
					)}
				>
					{/* Icon */}
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

					{/* Label */}
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

					{/* Accepted format badge */}
					{!isDragReject && (
						<div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
							<FileTextIcon className="h-3.5 w-3.5" />
							PDF only · max 50 MB
						</div>
					)}
				</div>
			)}
		</div>
	);
}
