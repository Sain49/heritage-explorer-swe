interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: PaginationProps) {
  // don't show pagination if only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center pt-4 border-t border-stone-400">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-stone-400 hover:border-amber-900 hover:bg-amber-50 focus:outline-none focus:border-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm text-stone-800"
      >
        ← Previous
      </button>

      <span className="text-sm text-stone-800 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-stone-400 hover:border-amber-900 hover:bg-amber-50 focus:outline-none focus:border-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm text-stone-800"
      >
        Next →
      </button>
    </div>
  );
}
