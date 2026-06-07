import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Fragment } from "react";

type AdminTablePaginationProps = {
  basePath: string;
  currentPage: number;
  pageParam?: string;
  pageSize: number;
  queryParams?: Record<string, string | undefined>;
  totalItems: number;
};

function clampPage(page: number, totalPages: number): number {
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

function createPageHref(
  basePath: string,
  pageParam: string,
  page: number,
  queryParams: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set(pageParam, String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function AdminTablePagination({
  basePath,
  currentPage,
  pageParam = "page",
  pageSize,
  queryParams = {},
  totalItems,
}: AdminTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = clampPage(currentPage, totalPages);

  if (totalPages <= 1) return null;

  const visiblePages = Array.from(
    new Set([1, activePage - 1, activePage, activePage + 1, totalPages])
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(
              basePath,
              pageParam,
              activePage - 1,
              queryParams,
            )}
            text="Sebelumnya"
            aria-disabled={activePage === 1}
            className={activePage === 1 ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldShowEllipsis = previousPage && page - previousPage > 1;

          return (
            <Fragment key={page}>
              {shouldShowEllipsis ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  href={createPageHref(basePath, pageParam, page, queryParams)}
                  isActive={page === activePage}
                  className={
                    page === activePage
                      ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : ""
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageHref(
              basePath,
              pageParam,
              activePage + 1,
              queryParams,
            )}
            text="Berikutnya"
            aria-disabled={activePage === totalPages}
            className={
              activePage === totalPages ? "pointer-events-none opacity-40" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
