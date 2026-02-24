import { memo } from "react";
import { ArrowDown, ArrowUp, ArrowUpAZ, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import UploadFiles from "@/features/file/components/upload-files";
import CreateFolder from "@/features/folder/components/create-folder";
import type { SortOption } from "@/types/sort";

interface DataRoomToolbarProps {
	parentId: string | null;
	dataRoomId: string;
	sortBy: SortOption;
	onSortChange: (option: SortOption) => void;
}

const DataRoomToolbar = memo(function DataRoomToolbar({
	parentId,
	dataRoomId,
	sortBy,
	onSortChange,
}: DataRoomToolbarProps) {
	return (
		<div className="flex items-center gap-2 border-b px-6 py-3">
			<CreateFolder parentId={parentId} dataRoomId={dataRoomId} />
			<UploadFiles parentId={parentId} dataRoomId={dataRoomId} />

			<Separator orientation="vertical" className="mx-2 h-6" />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="gap-2">
						<ArrowUpAZ className="h-4 w-4" />
						Sort
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						Sort by Name
					</div>
					<DropdownMenuItem
						onClick={() => onSortChange("name-asc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowUp className="h-4 w-4" />
							A–Z
						</span>
						{sortBy === "name-asc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSortChange("name-desc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowDown className="h-4 w-4" />
							Z–A
						</span>
						{sortBy === "name-desc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						Sort by Date Created
					</div>
					<DropdownMenuItem
						onClick={() => onSortChange("createdAt-desc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowDown className="h-4 w-4" />
							Newest first
						</span>
						{sortBy === "createdAt-desc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSortChange("createdAt-asc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowUp className="h-4 w-4" />
							Oldest first
						</span>
						{sortBy === "createdAt-asc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						Sort by Date Modified
					</div>
					<DropdownMenuItem
						onClick={() => onSortChange("updatedAt-desc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowDown className="h-4 w-4" />
							Newest first
						</span>
						{sortBy === "updatedAt-desc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSortChange("updatedAt-asc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowUp className="h-4 w-4" />
							Oldest first
						</span>
						{sortBy === "updatedAt-asc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						Sort by Size
					</div>
					<DropdownMenuItem
						onClick={() => onSortChange("size-asc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowUp className="h-4 w-4" />
							Smallest first
						</span>
						{sortBy === "size-asc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSortChange("size-desc")}
						className="flex items-center justify-between"
					>
						<span className="flex items-center gap-2">
							<ArrowDown className="h-4 w-4" />
							Largest first
						</span>
						{sortBy === "size-desc" && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
});

export default DataRoomToolbar;
