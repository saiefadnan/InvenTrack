using System.ComponentModel.DataAnnotations;

namespace InvenTrack.DTOs;

public class CreateCustomerDto
{
    [Required(ErrorMessage = "Customer name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Customer name must be at least 3 characters long")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Customer email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address format")]
    public string Email { get; set; } = string.Empty;
}
