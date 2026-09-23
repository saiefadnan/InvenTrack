# InvenTrack — Inventory & Order Management API

A production-grade RESTful API for inventory management and transactional order processing built with **ASP.NET Core 9** and **Entity Framework Core**. 

InvenTrack demonstrates relational domain modeling, atomic order fulfillment with inventory deduction, server-side LINQ filtering and pagination, DTO projection, and OpenAPI documentation with Scalar.

---

## 🌟 Key Architecture & Features

- **Relational Domain Modeling**: 5 interrelated entities managing a realistic multi-table schema (`Category`, `Product`, `Customer`, `Order`, `OrderItem`), including a proper many-to-many relationship with order-time price snapshotting.
- **DTO Pattern & API Decoupling**: Complete separation between database entities and client contracts to prevent over-posting vulnerabilities and avoid circular serialization loops.
- **Atomic Order Placement**: Multi-entity transactional write operations that validate customer status, verify stock levels, snapshot item prices, decrement product inventory, and commit atomically.
- **Advanced LINQ Queries**:
  - Filtering by category and stock availability.
  - Server-side pagination using `Skip` and `Take` over `IQueryable<T>`.
  - Dedicated low-stock alerting queries (`/api/products/low-stock?threshold=5`).
- **Eager Loading**: Strategic use of `.Include()` and `.ThenInclude()` to prevent N+1 query problems.
- **Input Validation**: Data Annotations enforcing model constraints and returning RFC 7807 Problem Details on invalid input.
- **Interactive API Documentation**: Modern API reference dashboard powered by **Scalar**.

---

## 🛠 Tech Stack

- **Framework**: .NET 9.0 (ASP.NET Core Web API)
- **ORM**: Entity Framework Core 9.0
- **Database**: SQLite (local development with configurable provider)
- **API Documentation**: Microsoft OpenAPI + Scalar
- **Tooling**: .NET CLI, EF Core Migrations

---

## 📊 Domain Model

```
Category (1) ───< (many) Product
Customer (1) ───< (many) Order
Order    (1) ───< (many) OrderItem >─── (many) Product
```

| Entity | Primary Key | Foreign Keys | Key Properties |
| :--- | :--- | :--- | :--- |
| **Category** | `Id` | — | `Name` |
| **Product** | `Id` | `CategoryId` | `Name`, `Price`, `StockQuantity` |
| **Customer** | `Id` | — | `Name`, `Email` |
| **Order** | `Id` | `CustomerId` | `OrderDate`, `Status` |
| **OrderItem** | `Id` | `OrderId`, `ProductId` | `Quantity`, `UnitPrice` (snapshot at order time) |

> **Note on `OrderItem`**: `UnitPrice` is stored directly on the `OrderItem` row rather than referencing the live `Product.Price`. This preserves historical accuracy when product prices change over time.

---

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- EF Core CLI tool (`dotnet tool install --global dotnet-ef`)

### 1. Clone the Repository
```bash
git clone https://github.com/saiefadnan/InvenTrack.git
cd InvenTrack
```

### 2. Apply Database Migrations
Run the EF Core migration to create your local database:
```bash
dotnet ef database update
```
*(This automatically creates `invenTrack.db` with all tables, constraints, and indexes).*

### 3. Run the Application
```bash
dotnet run
```
Or for auto-reload during development:
```bash
dotnet watch
```

### 4. Explore the API
Once running, open the interactive Scalar API dashboard in your browser:
👉 **http://localhost:5159/scalar/v1**

---

## 📡 API Endpoints Overview

### Categories (`/api/categories`)
- `GET /api/categories` — List all categories
- `GET /api/categories/{id}` — Get category by ID
- `POST /api/categories` — Create category (returns 201 Created)
- `PUT /api/categories/{id}` — Update category (returns 204 No Content)
- `DELETE /api/categories/{id}` — Delete category (returns 204 No Content)

### Products (`/api/products`)
- `GET /api/products?categoryId=1&inStock=true&page=1&pageSize=10` — Filtered & paginated product list
- `GET /api/products/low-stock?threshold=5` — Alert list of products below stock threshold
- `GET /api/products/{id}` — Get single product with flattened `CategoryName`
- `POST /api/products` — Create product with foreign key validation
- `PUT /api/products/{id}` — Update product
- `DELETE /api/products/{id}` — Delete product

### Customers (`/api/customers`)
- `GET /api/customers` — List all customers
- `GET /api/customers/{id}` — Get customer by ID
- `POST /api/customers` — Create customer
- `GET /api/customers/{id}/orders` — Nested resource: full order history for a customer

### Orders (`/api/orders`)
- `GET /api/orders` — List all orders with items and customer details
- `GET /api/orders/{id}` — Get order by ID with line items and product details
- `POST /api/orders` — Place order with atomic stock verification & decrement

---

## 📝 Example Request & Response

### Place an Order (`POST /api/orders`)

**Request Payload:**
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "orderDate": "2026-09-20T13:15:00Z",
  "status": "Pending",
  "customerId": 1,
  "customerName": "Alice Smith",
  "totalAmount": 199.98,
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Mechanical Keyboard",
      "quantity": 2,
      "unitPrice": 89.99,
      "lineTotal": 179.98
    },
    {
      "productId": 3,
      "productName": "Gaming Mouse Pad",
      "quantity": 1,
      "unitPrice": 20.00,
      "lineTotal": 20.00
    }
  ]
}
```

---

## 💡 Key Architectural Design Decisions

1. **Why DTOs instead of Entities?**
   Returning EF Core entity models directly causes recursive serialization loops (e.g. `Product` $\leftrightarrow$ `Category`). DTOs decouple the external API contract from the internal relational schema and eliminate over-posting vulnerabilities.
2. **`IQueryable<T>` vs `IEnumerable<T>`**:
   All filtering and pagination operations run against `IQueryable<T>`. EF Core translates expressions (`.Where()`, `.Skip()`, `.Take()`) into SQL `WHERE`, `LIMIT`, and `OFFSET` clauses. Only the requested records are returned from the database, rather than loading entire tables into memory.
3. **Deep Eager Loading**:
   Nested queries utilize `.Include(o => o.OrderItems).ThenInclude(oi => oi.Product)` to perform join operations upfront, preventing the performance penalty of N+1 database round-trips.
4. **Data Consistency (Atomicity)**:
   Order placement executes within a single unit of work. If stock verification fails for any item in an order, none of the changes are written, ensuring inventory counts remain 100% accurate.

