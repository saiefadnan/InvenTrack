import { useQuery } from "@tanstack/react-query";
import type { DashboardSummary, TopSellingProduct } from "../types";
import { fetchDashboardSummary, fetchTopSellingProducts } from "../api/dashboardInfoApi";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["reports", "summary"],
    queryFn: () => fetchDashboardSummary(),
  });
};

export const useTopSellingReport = (limit = 5) => {
  return useQuery<TopSellingProduct[]>({
    queryKey: ["reports", "top-selling", limit],
    queryFn: () => fetchTopSellingProducts(limit),
  });
};
