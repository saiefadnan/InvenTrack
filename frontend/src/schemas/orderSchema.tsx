import z from "zod";

export const createOrderItemSchema = z.object({
    productId: z
        .number()
        .int()
        .positive("Product ID must be a positive number"),

    quantity: z
        .number()
        .int()
        .positive("Quantity must be a positive number"),
});

export const createOrderSchema = z.object({
    customerId: z
        .coerce
        .number()
        .int()
        .positive("Customer ID must be a positive number"),
    selectedProductId: z.number().int().positive("Product ID must be a positive number"),
    items: z.array(createOrderItemSchema).nonempty({ message: "At least one item is required" }),
    requiredQuantity: z.number().int().positive("Required quantity must be a positive number").optional(),
})

.refine((data)=>{
    if(data.requiredQuantity===undefined) return true;
    const selectedItem = data.items.find(item => item.productId === data.selectedProductId);
    if(!selectedItem) return true;
    return selectedItem.quantity >= data.requiredQuantity;
},{
    message: "Required quantity exceeds available stock for the selected product",
    path: ["requiredQuantity"],
});

export type createOrderFormData = z.infer<typeof createOrderSchema>;
