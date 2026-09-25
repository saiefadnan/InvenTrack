namespace InvenTrack.DTOs;

public class TopSellingProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int UnitsSold { get; set; }
    public decimal TotalRevenue { get; set; }
}