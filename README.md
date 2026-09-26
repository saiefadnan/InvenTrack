# InvenTrack — Enterprise Inventory & Order Management System

[![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Dapper](https://img.shields.io/badge/ORM-EF_Core_9_%2B_Dapper-E34F26)](https://github.com/DapperLib/Dapper)
[![SignalR](https://img.shields.io/badge/Real--Time-SignalR_WebSockets-512BD4)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**InvenTrack** is a full-stack, enterprise-grade inventory and order management system built with **ASP.NET Core 9**, **Entity Framework Core 9**, **Dapper**, **SignalR WebSockets**, and a modern **React 19 + TypeScript + TanStack Query v5** single-page application.

Designed using a **Hybrid ORM architecture** (CQRS-lite), InvenTrack leverages EF Core for transactional write operations and Dapper for sub-millisecond analytical aggregations. Real-time telemetry powered by SignalR guarantees that stock decrements and new order events instantly propagate across all connected clients via push-based cache invalidation.

---

## 🏗 System Architecture

```
                                      ┌──────────────────────────────────────────────┐
                                      │              React 19 Frontend               │
                                      │  (Vite • TypeScript • TanStack Query v5)     │
                                      └──────┬───────────────────────────────▲───────┘
                                             │ HTTP REST                     │ WebSockets
                                             │ Mutations                     │ Real-time Events
                                             ▼                               │
┌────────────────────────────────────────────────────────────────────────────┴───────┐
│                                ASP.NET Core 9 Web API                              │
├────────────────────────────────────────────┬───────────────────────────────────────┤
│               COMMAND STACK                │              QUERY STACK              │
│        (Transactional Writes & Unit)       │     (High-Performance Analytical)     │
│                                            │                                       │
│          Entity Framework Core 9           │                Dapper                 │
│   • Atomic Orders (BeginTransactionAsync)  │   • Scalar Subquery Aggregations      │
│   • Stock Deductions & Snapshot Pricing    │   • Multi-table GROUP BY Leaderboard  │
│   • Change Tracker & Navigation Graph      │   • Sub-millisecond Execution         │
└─────────────────────┬──────────────────────┴───────────────────┬───────────────────┘
                      │                                          │
                      └───────────────────┬──────────────────────┘
                                          │ Shared ADO.NET Connection
                                          ▼
                               ┌─────────────────────┐
                               │   SQLite Database   │
                               │   (invenTrack.db)   │
                               └─────────────────────┘
```

---

## ✨ Key Architectural Highlights

### 1. Hybrid ORM Pattern (EF Core 9 + Dapper)
- **EF Core 9 for Commands:** Manages entity graphs, foreign key relationships, migrations, and transactional write pipelines where strict ACID integrity is critical.
- **Dapper for Queries & Reporting:** Executes raw, optimized SQL directly on the shared ADO.NET connection (`_context.Database.GetDbConnection()`). Aggregates total inventory valuation, revenue, order counts, and top-selling product leaderboards in a single database round-trip without change-tracker or expression-tree overhead.

### 2. Real-Time Telemetry with SignalR (WebSockets)
- Server-side domain event broadcasting via `IHubContext<InventoryHub>`.
- Client-side hook (`useInventorySocket`) establishing automatic reconnecting WebSockets.
- **Push-based Cache Invalidation:** When an order is placed or inventory changes, the server broadcasts domain events (`ReceiveOrderPlace`, `ReceiveProductUpdate`). Connected browser clients instantly invalidate their TanStack Query cache, synchronizing stock badges and KPI cards without polling.

### 3. Atomic Order Processing & Snapshot Pricing
- Orders execute within an explicit database transaction (`BeginTransactionAsync`).
- Enforces stock availability checks and atomic inventory decrements.
- **Snapshot Pricing:** Historical order items store the `UnitPrice` captured at order placement time rather than referencing live product prices, preventing retroactive order corruption when prices change.

### 4. Modern React 19 SPA Architecture
- **Polymorphic Table Component:** Generic `<Table<T>>` with fully typed column definitions and custom cell renderers.
- **Dynamic Reusable Modal:** Dynamic stepper controls, checkbox item pickers, and real-time nested array validation powered by **React Hook Form** + **Zod**.
- **60fps Animated Counters:** Custom `useCountUp` hook using native `requestAnimationFrame` with cubic ease-out deceleration for smooth KPI metric roll-ups.
- **Tailwind CSS Enterprise Theme:** Dark-mode glassmorphic cards, contextual status badges, and responsive layouts.

---

## 📊 Domain Model

```
Category (1) ───< (many) Product
Customer (1) ───< (many) Order
Order    (1) ───< (many) OrderItem >─── (many) Product
```

| Entity | Key Properties | Relationships |
| :--- | :--- | :--- |
| **Category** | `Id`, `Name` | 1-to-many with `Product` |
| **Product** | `Id`, `Name`, `Price`, `StockQuantity`, `CategoryId` | Belongs to `Category`, many-to-many with `Order` via `OrderItem` |
| **Customer** | `Id`, `Name`, `Email` | 1-to-many with `Order` |
| **Order** | `Id`, `CustomerId`, `OrderDate`, `Status` | Belongs to `Customer`, 1-to-many with `OrderItem` |
| **OrderItem** | `Id`, `OrderId`, `ProductId`, `Quantity`, `UnitPrice` | Join entity with point-in-time price snapshot |

---

## 📡 API Endpoints

### 📦 Reports & Analytics (Dapper)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/summary` | Subquery-aggregated inventory valuation, revenue, customer and product counts |
| `GET` | `/api/reports/top-selling?limit=5` | Leaderboard joining products, categories, and order items sorted by units sold |

### ⚡ Real-Time WebSockets (SignalR)
| Endpoint | Protocol | Events Broadcasted |
| :--- | :--- | :--- |
| `/inventory` | WebSockets (SSE/Long-Polling fallback) | `ReceiveOrderPlace`, `ReceiveProductUpdate` |

### 🛒 Orders & Fulfillment (EF Core)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders` | List all orders with eager-loaded items and customer data |
| `GET` | `/api/orders/{id}` | Get detailed order by ID |
| `POST` | `/api/orders` | Place atomic order with transactional inventory deductions |

### 🏷 Products & Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Filtered (by category & stock) and paginated product list |
| `GET` | `/api/products/low-stock?threshold=5` | Dedicated low-stock alert query |
| `POST` | `/api/products` | Create product (broadcasts `ReceiveProductUpdate`) |
| `PUT` | `/api/products/{id}` | Update product (broadcasts `ReceiveProductUpdate`) |
| `DELETE` | `/api/products/{id}` | Delete product (broadcasts `ReceiveProductUpdate`) |
| `GET` | `/api/categories` | List all product categories |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/) & `npm`

### 1. Backend Setup
```bash
cd backend

# Restore dependencies
dotnet restore

# Run database migrations (creates SQLite database invenTrack.db)
dotnet ef database update

# Start backend server
dotnet watch
```
Backend runs at: **http://localhost:5159**  
Interactive API Documentation: **http://localhost:5159/scalar/v1**

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🎯 Architectural Interview Defense

### 1. Why use a Hybrid ORM (EF Core + Dapper) instead of picking just one?
> *"EF Core is ideal for commands: it provides transactional units of work (`BeginTransactionAsync`), entity lifecycle tracking, and navigation properties for complex domain writes. However, for analytical read queries with multi-table aggregations, EF Core's change tracker and expression tree compilation introduce unnecessary CPU and allocation overhead. Dapper executes raw, parameterized SQL directly on the shared ADO.NET connection and maps results into DTOs in sub-milliseconds."*

### 2. Why use push-based cache invalidation over WebSockets instead of polling?
> *"Polling wastes bandwidth and server compute by continually asking for updates when nothing has changed. By emitting lightweight SignalR domain events (`ReceiveOrderPlace`, `ReceiveProductUpdate`), connected clients only invalidate their TanStack Query cache when actual state transitions occur in the database. This keeps all users synchronized in real-time with zero polling overhead."*

### 3. What is snapshot pricing and why is it mandatory in order systems?
> *"A product's price can change over time. If an order line item simply references `Product.Price`, updating the price of a product today would retroactively alter the financial totals of orders placed last year. By snapshotting `UnitPrice` directly on the `OrderItem` record during order placement, historical accounting remains immutable and accurate."*

### 4. What is the N+1 query problem, and how was it eliminated?
> *"Without eager loading, accessing an order's line items and customer records would execute 1 query to fetch orders plus N separate queries for each order's details. In InvenTrack, queries use `.Include(o => o.OrderItems).ThenInclude(oi => oi.Product)` or Dapper multi-table joins to execute single-query joins up front."*

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
