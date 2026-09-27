import { useState } from "react";
import {
  StatCard,
  Table,
  Modal,
  PageHeader,
  Badge,
  SearchFilterBar,
  ActionButtons,
} from "../components";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
} from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import type { CreateProductDto, Product } from "../types";
import { createProductSchema } from "../schemas/productSchema";
import { useDashboardSummary } from "../hooks/useReports";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [productTablePage, setProductTablePage] = useState(1);
  const {
    data: productResults,
    isLoading: productsLoading,   
    isError: productsError,
  } = useProducts({ categoryId: selectedCategory, page: productTablePage });
  const { data: dashboardSummary } = useDashboardSummary();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();
  const createProductMutation = useCreateProduct();

  const products = productResults?.results || [];
  const hasNextProducts = productResults?.hasNext || false;
  const hasPrevProducts = productResults?.hasPrev || false;
  const totalProducts = dashboardSummary?.totalProducts || 0;
  const totalCategories = dashboardSummary?.totalCategories || 0;
  const totalLowStock = dashboardSummary?.lowStockCount || 0;
  const totalInventoryValue = dashboardSummary?.totalInventoryValue || 0;
  const totalRevenue = dashboardSummary?.totalRevenue || 0;
  const totalOutOfStockCount = dashboardSummary?.outOfStockCount || 0;

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (formData: CreateProductDto) => {
    setOpenModal(false);
    createProductMutation.mutate(formData);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          prefix="$"
          value={totalRevenue}
          subtitle="Total generated sales"
          variant="success"
        />
        <StatCard
          title="Out of Stock Products"
          value={totalOutOfStockCount}
          subtitle="Products that are currently unavailable"
          variant="danger"
        />
        <StatCard
          title="Low Stock Items"
          value={totalLowStock}
          subtitle="Products running low"
          variant="warning"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Inventory Value"
          prefix="$"
          value={totalInventoryValue}
          subtitle="Across all categories"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Across all categories"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          subtitle="Across all categories"
        />
      </div>

      <div className="space-y-4">
        <PageHeader
          title="Products Inventory"
          subtitle="Manage your catalog, stock levels, and pricing"
          actionLabel="+ Add Product"
          onAction={() => setOpenModal(true)}
        />

        <Modal<CreateProductDto>
          title="Add new product"
          fields={[
            { label: "Name", name: "name", type: "text" },
            { label: "Price", name: "price", type: "number" },
            { label: "Stock Quantity", name: "stockQuantity", type: "number" },
            {
              label: "Category",
              name: "categoryId",
              type: "select",
              options: categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            },
          ]}
          validationSchema={createProductSchema}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={onSubmit}
        />

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

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
                <Badge variant="neutral" pill={false}>
                  {catName}
                </Badge>
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
                  return <Badge variant="danger">Out of Stock</Badge>;
                }
                if (product.stockQuantity <= 5) {
                  return <Badge variant="warning">Low Stock</Badge>;
                }
                return <Badge variant="success">In Stock</Badge>;
              },
            },
            {
              key: "actions",
              label: "Actions",
              render: (_, product) => (
                <ActionButtons
                  onEdit={() => {}}
                  onDelete={() => handleDelete(product.id, product.name)}
                  isDeleting={deleteMutation.isPending}
                />
              ),
            },
          ]}
          hasNext={hasNextProducts}
          hasPrev={hasPrevProducts}
          onNext={() => setProductTablePage(productTablePage + 1)}
          onPrev={() => setProductTablePage(productTablePage - 1)}
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
