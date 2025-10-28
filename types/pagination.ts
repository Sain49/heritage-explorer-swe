// type definitions for pagination functionality

// pagination state and controls
export type PaginationState<T> = {
  currentPage: number; // Current page number (1-indexed)
  totalPages: number;
  paginatedItems: T[];
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void; // reset to page 1
  setCurrentPage: (page: number) => void; // jump to specific page
};

// pagination configuration
export type PaginationConfig = {
  itemsPerPage: number;
  initialPage?: number; // starting page (default: 1)
};

// pagination component props
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange?: (page: number) => void;
};
