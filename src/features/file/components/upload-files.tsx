import { useState } from "react";
import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import UploadFilesModal from "@/features/file/components/upload-files-modal";

interface UploadFilesProps {
	parentId: string | null;
	dataRoomId: string;
}

export default function UploadFiles({ parentId, dataRoomId }: UploadFilesProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				variant="outline"
				className="gap-2"
				onClick={() => setOpen(true)}
			>
				<UploadIcon className="h-4 w-4" />
				Upload Files
			</Button>

			<UploadFilesModal
				parentId={parentId}
				dataRoomId={dataRoomId}
				open={open}
				onOpenChange={setOpen}
			/>
		</>
	);
}
