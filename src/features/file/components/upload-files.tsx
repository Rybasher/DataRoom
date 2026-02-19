import { useRef } from "react";
import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUploadFiles } from "@/features/file/hooks";

interface UploadFilesProps {
	parentId: string | null;
	dataRoomId: string;
}

export default function UploadFiles({ parentId, dataRoomId }: UploadFilesProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useUploadFiles();

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);

		if (files.length === 0) return;

		mutate({ files, parentId, dataRoomId });

		// Reset so the same file(s) can be re-selected after upload
		e.target.value = "";
	};

	return (
		<>
			{/* Hidden native file input — multiple PDFs only */}
			<input
				ref={inputRef}
				type="file"
				multiple
				accept=".pdf,application/pdf"
				className="hidden"
				onChange={handleChange}
			/>

			<Button
				variant="outline"
				className="gap-2"
				loading={isPending}
				onClick={handleClick}
				disabled={isPending}
			>
				<UploadIcon className="h-4 w-4" />
				Upload Files
			</Button>
		</>
	);
}
