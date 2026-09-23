import type { TableProps } from "../types";

const Table = <T,>({
  columns,
  items,
  emptyMessage,
  isLoading,
  isError,
  keyField,
}: TableProps<T>) => {
  return (
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
  );
};

export default Table;
