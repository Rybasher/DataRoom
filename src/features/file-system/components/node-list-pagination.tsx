import { memo } from "react";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { totalPages } from "@/lib/utils/pagination";

interface NodeListPaginationProps {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
}

const MAX_VISIBLE = 5;

function NodeListPagination({
	page,
	limit,
	total,
	onPageChange,
}: NodeListPaginationProps) {
	const pages = totalPages(total, limit);
	if (pages <= 1) return null;

	const prevPage = Math.max(1, page - 1);
	const nextPage = Math.min(pages, page + 1);

	// Show a window of page numbers around current
	let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
	const end = Math.min(pages, start + MAX_VISIBLE - 1);
	if (end - start + 1 < MAX_VISIBLE) {
		start = Math.max(1, end - MAX_VISIBLE + 1);
	}
	const showStartEllipsis = start > 1;
	const showEndEllipsis = end < pages;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={(e) => {
							e.preventDefault();
							onPageChange(prevPage);
						}}
						className={
							page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
						}
					/>
				</PaginationItem>

				{showStartEllipsis && (
					<>
						<PaginationItem>
							<PaginationLink
								onClick={(e) => {
									e.preventDefault();
									onPageChange(1);
								}}
							>
								1
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					</>
				)}

				{Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
					(p) => (
						<PaginationItem key={p}>
							<PaginationLink
								isActive={p === page}
								onClick={(e) => {
									e.preventDefault();
									onPageChange(p);
								}}
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					),
				)}

				{showEndEllipsis && (
					<>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								onClick={(e) => {
									e.preventDefault();
									onPageChange(pages);
								}}
							>
								{pages}
							</PaginationLink>
						</PaginationItem>
					</>
				)}

				<PaginationItem>
					<PaginationNext
						onClick={(e) => {
							e.preventDefault();
							onPageChange(nextPage);
						}}
						className={
							page >= pages ? "pointer-events-none opacity-50" : "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

export default memo(NodeListPagination);
