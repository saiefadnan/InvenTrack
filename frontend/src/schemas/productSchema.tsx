import z from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name must not exceed 50 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stockQuantity: z.coerce
    .number()
    .int("Stock quantity must be an integer")
    .nonnegative("Stock quantity must be a non-negative number"),
  categoryId: z.coerce
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive number"),
});

