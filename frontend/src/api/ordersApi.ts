import type { CreateOrderDto, Order } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const fetchOrders = async (): Promise<Order[]> => {
    return await apiClient.get<Order[]>(ENDPOINTS.orders.base);
};

export const fetchOrderById = async (id: number): Promise<Order> => {
    return await apiClient.get<Order>(ENDPOINTS.orders.byId(id));
};

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
    return await apiClient.post<Order>(ENDPOINTS.orders.base, data);
};
