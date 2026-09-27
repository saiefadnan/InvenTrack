import { useState } from "react";
import {
  Modal,
  Table,
  StatCard,
  PageHeader,
  Badge,
  ActionButtons,
} from "../components";
import { useCreateOrder, useOrders } from "../hooks/useOrders";
import type { CreateOrderDto, Order, TopSellingProduct } from "../types";
import { createOrderSchema } from "../schemas/orderSchema";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
import { useDashboardSummary, useTopSellingReport } from "../hooks/useReports";

const Orders = () => {
  const [ordersPage, setOrdersPage] = useState(1);
  const [productListPage, setProductTablePage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const { data: orderResults, isLoading } = useOrders({ page: ordersPage });
  const { data: customers = [] } = useCustomers();
  const { data: productResults } = useProducts({ page: productListPage });
  const createOrderMutation = useCreateOrder();
  const { data: dashboardSummary } = useDashboardSummary();
  const { data: topSellingProducts = [], isLoading: isTopSellingLoading } =
    useTopSellingReport();
  const onSubmit = (formData: CreateOrderDto) => {
    setOpenModal(false);
    createOrderMutation.mutate(formData);
  };

  const orders = orderResults?.results || [];
  const hasNextOrders = orderResults?.hasNext || false;
  const hasPrevOrders = orderResults?.hasPrev || false;
  const products = productResults?.results || [];
  const hasNextProducts = productResults?.hasNext || false;
  const hasPrevProducts = productResults?.hasPrev || false;
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
        />
        <StatCard
          title="Out of Stock Products"
          value={totalOutOfStockCount}
          subtitle="Products that are currently unavailable"
          variant="danger"
        />
      </div>

      {/* Header */}
      <PageHeader
        title="Orders Management"
        subtitle="View and track customer orders and stock allocations"
        actionLabel="+ Add Order"
        onAction={() => setOpenModal(true)}
      />

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
                `$${Number(product.price).toFixed(2)}`,
                `${product.stockQuantity} in stock`,
              ],
            })),
            hasNextOptions: hasNextProducts,
            hasPrevOptions: hasPrevProducts,
            onNextOptions: () => setProductTablePage((p) => p + 1),
            onPrevOptions: () => setProductTablePage((p) => p - 1),
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
              <Badge variant="neutral" pill={false}>
                {customerName}
              </Badge>
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
            render: (status) => {
              const variant =
                status === "Delivered" || status === "Completed"
                  ? "success"
                  : status === "Cancelled"
                  ? "danger"
                  : "warning";
              return <Badge variant={variant}>{status}</Badge>;
            },
          },
          {
            key: "actions",
            label: "Actions",
            render: () => (
              <ActionButtons
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ),
          },
        ]}
        hasNext={hasNextOrders}
        hasPrev={hasPrevOrders}
        onNext={() => setOrdersPage((p) => p + 1)}
        onPrev={() => setOrdersPage((p) => p - 1)}
        items={orders}
        emptyMessage="No orders found"
        isLoading={isLoading}
        isError={false}
      />

      <PageHeader
        title="Top selling products"
        subtitle="View and track top selling products"
      />

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
              <Badge variant="neutral" pill={false}>
                {productName}
              </Badge>
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
                $
                {Number(totalRevenue).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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

