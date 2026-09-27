import type { TableProps } from "../types";

const Table = <T,>({
  columns,
  items,
  emptyMessage,
  isLoading,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  isError,
  keyField,
}: TableProps<T>) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                {columns?.map((col) => (
                  <th key={String(col.key)} className="px-6 py-3">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-sm"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-sm"
                  >
                    Error loading orders.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-slate-400 text-sm"
                  >
                    {emptyMessage ?? "No records found!"}
                  </td>
                </tr>
              ) : (
                items.map((item: any) => {
                  return (
                    <tr
                      key={String(keyField ? item[keyField] : (item as any).id)}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-6 py-4">
                          {col.render
                            ? col.render((item as any)[col.key], item)
                            : String((item as any)[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(onNext || onPrev) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-1 text-sm text-slate-400">
          <p className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-200">{items.length}</span> {items.length === 1 ? "record" : "records"}
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              disabled={!hasPrev}
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:border-slate-800 disabled:hover:text-slate-400 text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>Prev</span>
            </button>
            <button
              disabled={!hasNext}
              onClick={onNext}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:border-slate-800 disabled:hover:text-slate-400 text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
