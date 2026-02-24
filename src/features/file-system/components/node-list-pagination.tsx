import { memo } from "react";

import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import { totalPages } from "@/lib/utils/pagination";

interface NodeListPaginationProps {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

const MAX_VISIBLE = 5;

function NodeListPagination({
	page,
	limit,
	total,
	onPageChange,
	onLimitChange,
}: NodeListPaginationProps) {
	if (total === 0) return null;

	const pages = totalPages(total, limit);

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
		<div className="flex items-center justify-between gap-6 pt-1">
			<div className="flex items-center gap-3">
				<span className="whitespace-nowrap text-sm text-muted-foreground">
					Items per page:
				</span>
				<div className="flex items-center gap-2">
					{PAGE_SIZE_OPTIONS.map((size) => (
						<Button
							key={size}
							size="sm"
							variant={size === limit ? "default" : "outline"}
							className="min-w-10"
							onClick={() => onLimitChange(size)}
						>
							{size}
						</Button>
					))}
				</div>
			</div>

			{pages > 1 && (
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
			)}
		</div>
	);
}

export default memo(NodeListPagination);
