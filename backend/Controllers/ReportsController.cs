using Dapper;
using InvenTrack.Data;
using InvenTrack.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvenTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardReportDto>> GetSummary()
    {
        var connection = _context.Database.GetDbConnection();
        const string sql = """
        SELECT 
            COALESCE((SELECT SUM(Price * StockQuantity) FROM Products),0) AS TotalInventoryValue,
            COALESCE((SELECT SUM(Quantity * UnitPrice) FROM OrderItems),0) AS TotalRevenue,
            (SELECT COUNT(*) FROM Orders) AS TotalOrders,
            (SELECT COUNT(*) FROM Products) AS TotalProducts,  
            (SELECT COUNT(*) FROM Categories) AS TotalCategories,
            (SELECT COUNT(*) FROM Customers) AS TotalCustomers,
            (SELECT COUNT(*) FROM Products WHERE StockQuantity > 0 AND StockQuantity <= 5) AS LowStockCount,
            (SELECT COUNT(*) FROM Products WHERE StockQuantity = 0) AS OutOfStockCount
        """;

        var summary = await connection.QuerySingleOrDefaultAsync<DashboardReportDto>(sql);

        return Ok(summary);
    }

    [HttpGet("top-selling")]
    public async Task<ActionResult<IEnumerable<TopSellingProductDto>>> GetTopSellingProducts([FromQuery] int limit = 5)
    {
        var connection = _context.Database.GetDbConnection();
        const string sql = """
        SELECT 
            P.Id AS ProductId,
            P.Name AS ProductName,
            C.Name AS CategoryName,
            SUM(OI.Quantity) AS UnitsSold,
            COALESCE(SUM(OI.Quantity * OI.UnitPrice),0) AS TotalRevenue
        FROM Products P
        JOIN Categories C ON P.CategoryId = C.Id
        JOIN OrderItems OI ON P.Id = OI.ProductId
        GROUP BY P.Id, P.Name, C.Name
        ORDER BY UnitsSold DESC
        LIMIT @Limit;
        """;

        var summary = await connection.QueryAsync<TopSellingProductDto>(sql, new
        {
            Limit = limit
        });

        return Ok(summary);
    }
}