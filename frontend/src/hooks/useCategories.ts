import { useQuery } from "@tanstack/react-query"
import type { CategoryFilters } from "../types";
import { fetchCategories } from "../api/categoriesApi";

export const useCategories = (filters: CategoryFilters = {}) => {
    return useQuery({
        queryKey: ['categories', filters],
        queryFn: () => fetchCategories(filters),
    });
}