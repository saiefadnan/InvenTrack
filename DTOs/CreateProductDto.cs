using System.ComponentModel.DataAnnotations;

namespace InvenTrack.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(100, MinimumLength=3, ErrorMessage="Product name must be at least 3 characters long")]
    public string Name { get; set; } = string.Empty;
    
    [Range(0.01, double.MaxValue, ErrorMessage="Price must be a non-negative number")]
    public decimal Price { get; set; }
    
    [Range(0, int.MaxValue, ErrorMessage="Stock quantity must be a non-negative number")]
    public int StockQuantity { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage="A valid Category Id is required")]
    public int CategoryId { get; set; }
}