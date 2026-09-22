import type { CreateProductDto, Product, ProductFilters } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const fetchProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
    return await apiClient.get<Product[]>(ENDPOINTS.products.base, { params: filters });
};

export const fetchLowStockProducts = async (threshold: number = 5): Promise<Product[]> => {
    return await apiClient.get<Product[]>(ENDPOINTS.products.lowStock(threshold));
};

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
    return await apiClient.post<Product>(ENDPOINTS.products.base, data);
};

export const deleteProduct = async (id: number): Promise<void> => {
    return await apiClient.delete<void>(ENDPOINTS.products.byId(id));
};