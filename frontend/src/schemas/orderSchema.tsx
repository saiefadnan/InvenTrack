import z from "zod";
import type { Product } from "../types";

export const createOrderItemSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive number"),

  quantity: z.number().int().positive("Quantity must be a positive number"),
});

export const createOrderSchema = (products: Product[]) =>
  z.object({
    customerId: z.coerce
      .number()
      .int()
      .positive("Customer ID must be a positive number"),
    orderedItems: z
      .array(
        z.object({
          productId: z.coerce.number().int().positive("Product ID is required"),
          quantity: z.coerce
            .number()
            .int()
            .min(1, "Quantity must be at least 1"),
        }),
      )
      .nonempty({ message: "At least one item is required" })
      .superRefine((items, ctx) => {
        items.forEach((item, _) => {
          const product = products.find((p) => p.id === item.productId);
          if (product && product.stockQuantity < item.quantity) {
            ctx.addIssue({
              code: "custom",
              message: `Only ${product.stockQuantity} left of ${product.name}`,
            });
          }
        });
      }),
  });

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
