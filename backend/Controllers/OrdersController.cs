using InvenTrack.Data;
using InvenTrack.DTOs;
using InvenTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvenTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer != null ? o.Customer.Name : string.Empty,
                TotalAmount = o.OrderItems.Sum(oi => oi.Quantity * oi.UnitPrice),
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound($"Order with ID {id} not found.");
        }

        var orderDto = new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            Status = order.Status,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer != null ? order.Customer.Name : string.Empty,
            TotalAmount = order.OrderItems.Sum(oi => oi.Quantity * oi.UnitPrice),
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList()
        };

        return Ok(orderDto);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {

        // 1. Validation: At least one item
        if (dto.OrderedItems == null || dto.OrderedItems.Count == 0)
        {
            return BadRequest("An order must contain at least one line item.");
        }

        // 2. Validate Customer exists
        var customer = await _context.Customers.FindAsync(dto.CustomerId);
        if (customer == null)
        {
            return NotFound($"Customer with ID {dto.CustomerId} not found.");
        }

        // 3. Begin an Explicit Database Transaction
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending"
            };

            var orderItemDtos = new List<OrderItemDto>();

            // 4. Validate products, check stock, and decrement inventory
            foreach (var itemDto in dto.OrderedItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {itemDto.ProductId} does not exist.");
                }

                if (product.StockQuantity < itemDto.Quantity)
                {
                    return BadRequest($"Insufficient stock for '{product.Name}'. Available: {product.StockQuantity}, Requested: {itemDto.Quantity}.");
                }

                // Decrement inventory
                product.StockQuantity -= itemDto.Quantity;

                // Snapshot current price at time of order
                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                order.OrderItems.Add(orderItem);

                orderItemDtos.Add(new OrderItemDto
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Commit transaction if all writes succeeded
            await transaction.CommitAsync();

            var resultDto = new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerId = customer.Id,
                CustomerName = customer.Name,
                TotalAmount = orderItemDtos.Sum(i => i.LineTotal),
                Items = orderItemDtos
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, resultDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"An error occurred while placing the order: {ex.Message}");
        }
    }
}
