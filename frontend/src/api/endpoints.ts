export const ENDPOINTS = {
  products: {
    base: '/products',
    lowStock: (threshold = 5) => `/products/low-stock?threshold=${threshold}`,
    byId: (id: number) => `/products/${id}`,
  },
  categories: {
    base: '/categories',
    byId: (id: number) => `/categories/${id}`,
  },
  orders: {
    base: '/orders',
    byId: (id: number) => `/orders/${id}`,
  },
  customers: {
    base: '/customers',
    byId: (id: number) => `/customers/${id}`,
    orders: (id: number) => `/customers/${id}/orders`,
  },
} as const;
