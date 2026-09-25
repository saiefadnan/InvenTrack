import { useState } from "react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { useCreateOrder, useOrders } from "../hooks/useOrders";
import type { CreateOrderDto, Order } from "../types";
import { createOrderSchema } from "../schemas/orderSchema";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const createOrderMutation = useCreateOrder();
  const [openModal, setOpenModal] = useState(false);
  const onSubmit = (formData: CreateOrderDto) => {
    setOpenModal(false);
    // alert(JSON.stringify(formData)); // you’ll see the proper shape now
    createOrderMutation.mutate(formData);
  };
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
    </main>
  );
};

export default Orders;
