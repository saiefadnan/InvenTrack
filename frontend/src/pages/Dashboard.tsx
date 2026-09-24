import { useState } from "react";
import StatCard from "../components/StatCard";
import {
  useCreateProduct,
  useDeleteProduct,
  useLowStockProducts,
  useProducts,
} from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import Table from "../components/Table";
import type { CreateProductDto, Product } from "../types";
import Modal from "../components/Modal";
import { createProductSchema } from "../schemas/productSchema";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({ categoryId: selectedCategory });
  const {
    data: lowStockProducts = [],
    isError: lowStockError,
    isLoading: lowStockIsLoading,
  } = useLowStockProducts(5);
  const {
    data: categories = [],
    isError: categoryError,
    isLoading: categoryIsLoading,
  } = useCategories();
  const deleteMutation = useDeleteProduct();
  const createProductMutation = useCreateProduct();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalLowStock = lowStockProducts.length;

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (formData:CreateProductDto) => {
    setOpenModal(false);
    // alert(JSON.stringify(formData));
    createProductMutation.mutate(formData);
  };

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
          <button
            onClick={() => setOpenModal(!openModal)}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        <Modal<CreateProductDto>
          title="Add new product"
          fields={[
            { label: "Name", name: "name", type: "text" },
            { label: "Price", name: "price", type: "number" },
            { label: "Stock Quantity", name: "stockQuantity", type: "number" },
            { label: "Category", name: "categoryId", type: "select" , options: categories.map((cat) => ({ value: cat.id, label: cat.name })) },
          ]}
          validationSchema={createProductSchema}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={onSubmit}
        />
        
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

        <Table<Product>
          columns={[
            {
              key: "name",
              label: "Product",
              render: (_, product) => (
                <div>
                  <div className="text-white font-semibold">{product.name}</div>
                  <div className="text-slate-400 text-xs">
                    ID: #{product.id}
                  </div>
                </div>
              ),
            },
            {
              key: "categoryName",
              label: "Category",
              render: (catName) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {catName}
                </span>
              ),
            },
            {
              key: "price",
              label: "Price",
              render: (price) => `$${Number(price).toFixed(2)}`,
            },
            {
              key: "stockQuantity",
              label: "Stock",
              render: (stock) => {
                const qty = Number(stock);
                return (
                  <span
                    className={
                      qty <= 5 ? "text-amber-400 font-medium" : "text-slate-300"
                    }
                  >
                    {qty} units
                  </span>
                );
              },
            },
            {
              key: "status",
              label: "Status",
              render: (_, product) => {
                if (product.stockQuantity === 0) {
                  return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Out of Stock
                    </span>
                  );
                }
                if (product.stockQuantity <= 5) {
                  return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Low Stock
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    In Stock
                  </span>
                );
              },
            },
            {
              key: "actions",
              label: "Actions",
              render: (_, product) => (
                <div className="space-x-9">
                  <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium cursor-pointer">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleteMutation.isPending}
                    className="text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          items={filteredProducts}
          emptyMessage="No products found"
          isLoading={productsLoading}
          isError={productsError}
        />
      </div>
    </main>
  );
};

export default Dashboard;
