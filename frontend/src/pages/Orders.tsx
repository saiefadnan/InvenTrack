import Table from "../components/Table";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types";

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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
        <div className="text-sm text-slate-400">
          Total Orders:{" "}
          <span className="font-semibold text-white">{orders.length}</span>
        </div>
      </div>

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
            render: (items) => (
              <div className="flex flex-col gap-1 text-xs">
                {items.map((item, idx) => (
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
        ]}
        items={orders}
        emptyMessage="No orders found"
        isLoading={isLoading}
        isError={false}
      />
    </main>
  );
};

export default Orders;
