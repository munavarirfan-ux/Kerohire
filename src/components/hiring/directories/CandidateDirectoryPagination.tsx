"use client";

import { DirectoryPagination } from "./DirectoryPagination";

export const CANDIDATES_PAGE_SIZE = 50;

export function CandidateDirectoryPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <DirectoryPagination
      page={page}
      totalPages={totalPages}
      totalCount={totalCount}
      pageSize={pageSize}
      onPageChange={onPageChange}
      itemLabel="candidates"
      className={className}
    />
  );
}
