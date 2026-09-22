import type { Category, CategoryFilters } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";


export const fetchCategories = async (filters:CategoryFilters = {}):Promise<Category[]> => {
    return await apiClient.get<Category[]>(ENDPOINTS.categories.base, {params:filters});
}