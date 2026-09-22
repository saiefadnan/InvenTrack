import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../api/customersApi";

export const useCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: fetchCustomers,
    });
};
