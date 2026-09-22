import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProductDto, ProductFilters } from "../types";
import { createProduct, deleteProduct, fetchLowStockProducts, fetchProducts } from "../api/productsApi";

export const useProducts = (filters: ProductFilters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
    });
};

export const useLowStockProducts = (threshold: number = 5) => {
    return useQuery({
        queryKey: ['products', 'low-stock', threshold],
        queryFn: () => fetchLowStockProducts(threshold),
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProductDto) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};