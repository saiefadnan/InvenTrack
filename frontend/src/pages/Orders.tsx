import { useState } from "react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { useCreateOrder, useOrders } from "../hooks/useOrders";
import type { CreateOrderDto, Order, TopSellingProduct } from "../types";
import { createOrderSchema } from "../schemas/orderSchema";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
import { useDashboardSummary, useTopSellingReport } from "../hooks/useReports";
import StatCard from "../components/StatCard";

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const createOrderMutation = useCreateOrder();
  const { data: dashboardSummary } = useDashboardSummary();
  const { data: topSellingProducts = [], isLoading: isTopSellingLoading } = useTopSellingReport();
  const [openModal, setOpenModal] = useState(false);
  const onSubmit = (formData: CreateOrderDto) => {
    setOpenModal(false);
    // alert(JSON.stringify(formData)); // you’ll see the proper shape now
    createOrderMutation.mutate(formData);
  };

  const totalOrders = dashboardSummary?.totalOrders || 0;
  const totalCustomers = dashboardSummary?.totalCustomers || 0;
  const totalOutOfStockCount = dashboardSummary?.outOfStockCount || 0;
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          subtitle="till date"
          variant="success"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          subtitle="Across all categories"
          variant="success"
        />
        <StatCard
          title="Out of Stock Products"
          value={totalOutOfStockCount}
          subtitle="Products that are currently unavailable"
          variant="danger"
        />
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Orders Management
          </h1>
          <p className="text-sm text-slate-400">
            View and track customer orders and stock allocations
          </p>
        </div>
      </div>
      <button
        onClick={() => setOpenModal(true)}
        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
      >
        + Add Order
      </button>

      <Modal<CreateOrderDto>
        title="Add new order"
        fields={[
          {
            label: "Customer",
            name: "customerId",
            type: "select",
            options: customers.map((customer) => ({
              value: customer.id,
              label: customer.name,
            })),
          },
          {
            label: "Ordered Items",
            name: "orderedItems",
            type: "checkbox",
            checkBoxFields: ["productId", "quantity"],
            options: products.map((product) => ({
              value: product.id,
              labels: [
                product.name,
                `-$${product.price}`,
                `${product.stockQuantity} left`,
              ],
            })),
          },
        ]}
        validationSchema={createOrderSchema(products)}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onSubmit}
      />

      <Table<Order>
        columns={[
          {
            key: "orderId",
            label: "Order ID",
            render: (_, order) => (
              <div>
                <div className="text-white font-semibold">{order.id}</div>
              </div>
            ),
          },
          {
            key: "customerName",
            label: "Customer",
            render: (customerName) => (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {customerName}
              </span>
            ),
          },
          {
            key: "orderDate",
            label: "Date",
            render: (orderDate) => (
              <span className="text-slate-300">
                {new Date(orderDate).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "items",
            label: "Items",
            render: (items: any) => (
              <div className="flex flex-col gap-1 text-xs">
                {items?.map((item: any, idx: number) => (
                  <span key={idx} className="text-slate-300">
                    {item.quantity}x {item.productName}
                  </span>
                ))}
              </div>
            ),
          },
          {
            key: "totalAmount",
            label: "Total Amount",
            render: (totalAmount) => (
              <span className="text-white font-semibold">
                ${totalAmount.toFixed(2)}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (status) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {status}
              </span>
            ),
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
                  // onClick={() => handleDelete(product.id, product.name)}
                  // disabled={deleteMutation.isPending}
                  className="text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        items={orders}
        emptyMessage="No orders found"
        isLoading={isLoading}
        isError={false}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Top selling products
          </h1>
          <p className="text-sm text-slate-400">
            View and track top selling products
          </p>
        </div>
      </div>

      <Table<TopSellingProduct>
        columns={[
          {
            key: "productId",
            label: "Product ID",
            render: (_, product) => (
              <div>
                <div className="text-white font-semibold">
                  {product.productId}
                </div>
              </div>
            ),
          },
          {
            key: "productName",
            label: "Product Name",
            render: (productName) => (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {productName}
              </span>
            ),
          },
          {
            key: "categoryName",
            label: "Category",
            render: (categoryName) => (
              <span className="text-slate-300">{categoryName}</span>
            ),
          },
          {
            key: "unitsSold",
            label: "Units Sold",
            render: (unitsSold) => (
              <span className="text-slate-300">{unitsSold}</span>
            ),
          },
          {
            key: "totalRevenue",
            label: "Total Amount",
            render: (totalRevenue) => (
              <span className="text-white font-semibold">
                ${Number(totalRevenue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            ),
          },
        ]}
        items={topSellingProducts}
        emptyMessage="No top selling products found"
        isLoading={isTopSellingLoading}
        isError={false}
      />
    </main>
  );
};

export default Orders;
