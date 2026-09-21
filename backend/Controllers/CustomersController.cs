using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvenTrack.Data;
using InvenTrack.Models;
using InvenTrack.DTOs;

namespace InvenTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/customers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
    {
        var customers = await _context.Customers
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email
            })
            .ToListAsync();

        return Ok(customers);
    }

    // GET: api/customers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        return Ok(new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email
        });
    }

    // POST: api/customers
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto dto)
    {
        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var result = new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email
        };

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, result);
    }

    // GET: api/customers/5/orders (Nested resource)
    [HttpGet("{id}/orders")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetCustomerOrders(int id)
    {
        var customerExists = await _context.Customers.AnyAsync(c => c.Id == id);
        if (!customerExists)
        {
            return NotFound($"Customer with ID {id} not found.");
        }

        var orders = await _context.Orders
            .Where(o => o.CustomerId == id)
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
}

