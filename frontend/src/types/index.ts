export interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    price: number;
    stockQuantity: number;
}

export interface CreateProductDto {
    name: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal?: number;
}

export interface Order {
    id: number;
    orderDate: string;
    status: string;
    customerId: number;
    customerName: string;
    totalAmount: number;
    items: OrderItem[];
}

export interface CreateOrderItemDto {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    customerId: number;
    items: CreateOrderItemDto[];
}

export interface DashboardStats {
    totalProducts: number;
    lowStockProducts: number;
    totalCategories: number;
}

export interface ProductFilters {
    categoryId?: number;
    inStock?: boolean;
    page?: number;
    pageSize?: number;
}

export interface CategoryFilters {
    page?: number;
    pageSize?: number;
}