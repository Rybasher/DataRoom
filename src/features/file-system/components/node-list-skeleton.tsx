import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const ROW_COUNT = 6;

// Matches the column layout of NodeList
export default function NodeListSkeleton() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12" />
					<TableHead className="min-w-[200px]">Name</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Modified</TableHead>
					<TableHead>Size</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: ROW_COUNT }).map((_, i) => (
					<TableRow key={i}>
						<TableCell>
							<Skeleton className="h-5 w-5 rounded" />
						</TableCell>
						<TableCell>
							{/* Vary widths so it looks natural */}
							<Skeleton className="h-4" style={{ width: `${140 + (i % 3) * 60}px` }} />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-20" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-20" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-12" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-8 w-8 rounded-md" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
