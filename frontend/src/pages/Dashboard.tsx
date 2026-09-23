import { useState } from "react";
import StatCard from "../components/StatCard";
import {
  useDeleteProduct,
  useLowStockProducts,
  useProducts,
} from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import Table from "../components/Table";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [] } = useProducts({ categoryId: selectedCategory });
  const { data: lowStockProducts = [] } = useLowStockProducts(5);
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalLowStock = lowStockProducts.length;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Across all categories"
        />
        <StatCard
          title="Low Stock Items"
          value={totalLowStock}
          subtitle="Products running low"
          variant="warning"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          subtitle="Across all categories"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Products Inventory
            </h2>
            <p className="text-sm text-slate-400">
              Manage your catalog, stock levels, and pricing
            </p>
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer">
            + Add Product
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory ?? ""}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Table
          columns={[
            { key: "name", label: "Product" },
            { key: "categoryName", label: "Category" },
            { key: "price", label: "Price" },
            { key: "stockQuantity", label: "Stock" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
          items={filteredProducts}
          deleteMutation={deleteMutation}
        />
      </div>
    </main>
  );
};

export default Dashboard;
