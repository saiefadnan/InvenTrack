interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  selectedCategory?: number;
  onCategoryChange?: (categoryId: number | undefined) => void;
  categories?: { id: number; name: string }[];
  allCategoriesLabel?: string;
}

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search products by name...",
  selectedCategory,
  onCategoryChange,
  categories = [],
  allCategoriesLabel = "All Categories",
}: SearchFilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>
      {onCategoryChange && (
        <div className="w-full sm:w-48">
          <select
            value={selectedCategory ?? ""}
            onChange={(e) =>
              onCategoryChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="">{allCategoriesLabel}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
