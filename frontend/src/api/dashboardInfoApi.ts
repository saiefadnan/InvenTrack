import type { DashboardSummary, TopSellingProduct } from "../types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const fetchDashboardSummary = async () => {
    return await apiClient.get<DashboardSummary>(ENDPOINTS.dashboard.summary);
};

export const fetchTopSellingProducts = async (limit = 5) => {
    return await apiClient.get<TopSellingProduct[]>(ENDPOINTS.dashboard.topSelling(limit));
};