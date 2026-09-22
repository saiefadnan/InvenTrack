import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderDto } from "../types";
import { createOrder, fetchOrders } from "../api/ordersApi";

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrderDto) => createOrder(data),
        onSuccess: () => {
            // Invalidate orders AND products so stock decrements are reflected immediately!
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
