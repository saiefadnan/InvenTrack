interface PaginationProps {
  count?: number;
  itemLabel?: string;
  itemsLabel?: string;
  hasNext: boolean;
  hasPrev: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

const Pagination = ({
  count,
  itemLabel = "record",
  itemsLabel = "records",
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  className = "flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-1 text-sm text-slate-400",
}: PaginationProps) => {
  return (
    <div className={className}>
      {count !== undefined && (
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-200">{count}</span>{" "}
          {count === 1 ? itemLabel : itemsLabel}
        </p>
      )}
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:border-slate-800 disabled:hover:text-slate-400 text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span>Prev</span>
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={onNext}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:border-slate-800 disabled:hover:text-slate-400 text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <span>Next</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
