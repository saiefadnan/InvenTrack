import type { Customer, Order } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const fetchCustomers = async (): Promise<Customer[]> => {
    return await apiClient.get<Customer[]>(ENDPOINTS.customers.base);
};

export const fetchCustomerById = async (id: number): Promise<Customer> => {
    return await apiClient.get<Customer>(ENDPOINTS.customers.byId(id));
};

export const fetchCustomerOrders = async (id: number): Promise<Order[]> => {
    return await apiClient.get<Order[]>(ENDPOINTS.customers.orders(id));
};
