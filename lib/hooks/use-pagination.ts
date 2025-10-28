import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  // current page number (starts at 1, not 0)
  const [currentPage, setCurrentPage] = useState(1);

  // calculate total pages based on items length
  // useMemo = only recalculate when items or itemsPerPage changes
  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  // Calculate which items to show on current page
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // next page (only if not on last page)
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // previous page (only if not on first page)
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // reset to page 1 (when search results change)
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    resetPage,
    setCurrentPage,
  };
}
