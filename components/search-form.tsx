interface SearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function SearchForm({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onReset,
  isLoading,
}: SearchFormProps) {
  return (
    <div className="mb-6 border border-stone-700 p-5 bg-stone-50">
      {/* Search input */}
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium mb-2 uppercase tracking-wide text-stone-800"
        >
          Search heritage sites
        </label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Vasa Museum, Gripsholm Castle, museum, castle..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="w-full px-4 py-3 border border-stone-400 bg-white focus:outline-none focus:border-stone-800 transition-colors duration-200"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="px-6 py-3 border border-amber-900 bg-amber-900 text-white hover:bg-amber-800 hover:border-amber-800 focus:outline-none focus:bg-amber-800 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm font-medium"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={onReset}
          className="px-6 py-3 border border-stone-600 bg-white text-stone-800 hover:border-stone-800 hover:bg-stone-100 focus:outline-none focus:border-stone-800 transition-colors duration-200 uppercase tracking-wide text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
