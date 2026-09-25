namespace InvenTrack.DTOs;

public class DashboardReportDto
{
    public decimal TotalInventoryValue { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }
}
