export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

export type TableProps<T> = {
  columns: Column<T>[];
  items: T[];
  deleteMutation: any;
};
const Table = <T,>({ columns, items, deleteMutation }: TableProps<T>) => {
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };
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
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                >
                  No products found matching your search.
                </td>
              </tr>
            ) : (
              items.map((item: any) => {
                const isLowStock = item.stockQuantity <= 5;
                const isOutOfStock = item.stockQuantity === 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-slate-500 text-xs">ID: #{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      ${item.price.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium ${isLowStock ? "text-amber-400" : "text-slate-300"}`}
                    >
                      {item.stockQuantity} units
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium cursor-pointer">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deleteMutation.isPending}
                        className="text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
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
