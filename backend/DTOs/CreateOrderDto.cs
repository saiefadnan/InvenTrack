using System.ComponentModel.DataAnnotations;

namespace InvenTrack.DTOs;

public class CreateOrderDto
{
    [Range(1, int.MaxValue, ErrorMessage = "A valid Customer ID is required")]
    public int CustomerId { get; set; }

    [MinLength(1, ErrorMessage = "An order must have at least one item")]
    public List<CreateOrderItemDto> OrderedItems { get; set; } = new();
}

public class CreateOrderItemDto
{
    [Range(1, int.MaxValue, ErrorMessage = "A valid Product ID is required")]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}
