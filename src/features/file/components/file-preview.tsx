import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	FileTextIcon,
	Loader2Icon,
	XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileBlobUrl } from "@/features/file/hooks/use-file-blob-url";
import type { FileNode } from "@/types/core";

// Initialize pdf.js worker (side-effect import, executed once)
import "@/lib/pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface FilePreviewProps {
	file: FileNode;
	onClose: () => void;
}

/**
 * Full-screen PDF preview overlay.
 * Must be conditionally mounted by the parent (e.g. `{open && <FilePreview />}`),
 * NOT hidden via an `open` prop — this guarantees clean state on every open.
 */
export default function FilePreview({ file, onClose }: FilePreviewProps) {
	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const contentRef = useRef<HTMLDivElement>(null);
	const [pageWidth, setPageWidth] = useState(700);

	// Always fetch when mounted; blob URL revoked automatically on unmount
	const { url, isLoading } = useFileBlobUrl(file.blobKey);

	// Keyboard: Escape to close, arrow keys to navigate pages
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				setCurrentPage((p) => Math.min(p + 1, numPages));
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				setCurrentPage((p) => Math.max(p - 1, 1));
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose, numPages]);

	// Responsive page width: fills the content area minus padding
	useEffect(() => {
		const el = contentRef.current;
		if (!el) return;

		const ro = new ResizeObserver(([entry]) => {
			const width = entry.contentRect.width - 32;
			if (width > 0) setPageWidth(Math.min(width, 800));
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const goToPrev = useCallback(() => setCurrentPage((p) => Math.max(p - 1, 1)), []);
	const goToNext = useCallback(
		() => setCurrentPage((p) => Math.min(p + 1, numPages)),
		[numPages],
	);

	const handleLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
		setCurrentPage(1);
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Panel */}
			<div className="relative z-10 flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">

				{/* Header */}
				<div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3">
					<div className="flex min-w-0 items-center gap-2">
						<FileTextIcon className="h-4 w-4 flex-shrink-0 text-red-500" />
						<span className="truncate font-medium">{file.name}</span>
					</div>

					<div className="flex items-center gap-3">
						{numPages > 0 && (
							<span className="text-sm text-muted-foreground tabular-nums">
								{currentPage} / {numPages}
							</span>
						)}
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							aria-label="Close preview"
						>
							<XIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* PDF content area */}
				<div
					ref={contentRef}
					className="flex flex-1 items-start justify-center overflow-auto bg-muted/20 p-4"
				>
					{isLoading && (
						<div className="flex h-full w-full items-center justify-center">
							<Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					)}

					{url && (
						<Document
							file={url}
							onLoadSuccess={handleLoadSuccess}
							loading={
								<div className="flex h-64 w-full items-center justify-center">
									<Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
								</div>
							}
							error={
								<p className="mt-8 text-sm text-destructive">
									Failed to load PDF. The file may be corrupted.
								</p>
							}
						>
							<Page
								pageNumber={currentPage}
								width={pageWidth}
								renderTextLayer
								renderAnnotationLayer
							/>
						</Document>
					)}
				</div>

				{/* Navigation footer — only shown for multi-page documents */}
				{numPages > 1 && (
					<div className="flex flex-shrink-0 items-center justify-center gap-3 border-t px-4 py-3">
						<Button
							variant="outline"
							size="icon"
							disabled={currentPage <= 1}
							onClick={goToPrev}
							aria-label="Previous page"
						>
							<ChevronLeftIcon className="h-4 w-4" />
						</Button>
						<span className="min-w-[100px] text-center text-sm text-muted-foreground tabular-nums">
							Page {currentPage} of {numPages}
						</span>
						<Button
							variant="outline"
							size="icon"
							disabled={currentPage >= numPages}
							onClick={goToNext}
							aria-label="Next page"
						>
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
