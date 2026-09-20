using System.ComponentModel.DataAnnotations;

namespace InvenTrack.DTOs;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Category name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Category name must be at least 3 characters long")]
    public string Name { get; set; } = string.Empty;
}

