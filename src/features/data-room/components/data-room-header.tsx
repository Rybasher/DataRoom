import { memo } from "react";
import { HomeIcon } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { FolderNode } from "@/types/core";

interface DataRoomHeaderProps {
	dataRoomName: string;
	breadcrumbPath: FolderNode[];
	onNavigate: (folderId: string | null) => void;
}

const DataRoomHeader = memo(function DataRoomHeader({
	dataRoomName,
	breadcrumbPath,
	onNavigate,
}: DataRoomHeaderProps) {
	return (
		<header className="flex h-16 items-center border-b px-6">
			<Breadcrumb>
				<BreadcrumbList>
					{/* Root — always links back to data room root */}
					<BreadcrumbItem>
						<BreadcrumbLink
							className="flex items-center gap-2 cursor-pointer"
							onClick={() => onNavigate(null)}
						>
							<HomeIcon className="h-4 w-4" />
							{dataRoomName}
						</BreadcrumbLink>
					</BreadcrumbItem>

					{breadcrumbPath.map((folder, index) => (
						<>
							<BreadcrumbSeparator key={`sep-${folder.id}`} />
							<BreadcrumbItem key={folder.id}>
								{index === breadcrumbPath.length - 1 ? (
									<BreadcrumbPage>{folder.name}</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="cursor-pointer"
										onClick={() => onNavigate(folder.id)}
									>
										{folder.name}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
});

export default DataRoomHeader;
