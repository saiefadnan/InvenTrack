using InvenTrack.Data;
using InvenTrack.DTOs;
using InvenTrack.Hubs;
using InvenTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace InvenTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<InventoryHub> _hubContext;

    public ProductsController(AppDbContext context, IHubContext<InventoryHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // GET: api/products?categoryId=1&inStock=true&page=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] int? categoryId = null,
        [FromQuery] bool? inStock = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        IQueryable<Product> query = _context.Products.Include(p => p.Category);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (inStock.HasValue)
        {
            query = inStock.Value
                ? query.Where(p => p.StockQuantity > 0)
                : query.Where(p => p.StockQuantity == 0);
        }

        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/low-stock?threshold=5
    [HttpGet("low-stock")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetLowStockProducts([FromQuery] int threshold = 5)
    {
        var lowStock = await _context.Products
            .Where(p => p.StockQuantity < threshold)
            .Include(p => p.Category)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .ToListAsync();

        return Ok(lowStock);
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound();

        return Ok(new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryId = product.CategoryId,
            CategoryName = product.Category != null ? product.Category.Name : string.Empty
        });
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> PostProduct(CreateProductDto dto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists) return BadRequest("Category not found");

        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            CategoryId = dto.CategoryId
        };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", new
        {
            Action = "Created",
            ProductId = product.Id,
            product.Name
        });

        var resultDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryId = product.CategoryId,
            CategoryName = product.Category != null ? product.Category.Name : string.Empty
        };
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, resultDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, CreateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists) return BadRequest("Category not found");

        product.Name = dto.Name ?? product.Name;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity ;
        product.CategoryId = dto.CategoryId ;

        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", new
        {
            Action = "Updated",
            ProductId = product.Id,
            product.Name
        });

        return NoContent();

    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)

    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", new
        {
            Action = "Deleted",
            ProductId = id
        });

        return NoContent();
    }
}