import type { CreateOrderDto, Order, PagedResult } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const fetchOrders = async (
  params: { page?: number; pageSize?: number } = {},
): Promise<PagedResult<Order>> => {
  return await apiClient.get<PagedResult<Order>>(ENDPOINTS.orders.base, {
    params,
  });
};

export const fetchOrderById = async (id: number): Promise<Order> => {
    return await apiClient.get<Order>(ENDPOINTS.orders.byId(id));
};

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
    return await apiClient.post<Order>(ENDPOINTS.orders.base, data);
};
