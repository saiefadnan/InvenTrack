# Inventory & Order Management API — Build Plan

**Stack:** ASP.NET Core 9 Web API, Entity Framework Core 9, Dapper, SignalR, SQLite / SQL Server, React 19, TypeScript, TanStack Query v5, Tailwind CSS
**Goal:** An enterprise ERP inventory system with hybrid ORM and real-time WebSockets that you can defend in any senior .NET interview.
**Rule for every step below:** don't copy-paste without understanding — if a step says "this happens because X," be able to explain X out loud before moving to the next step.

---

## Domain Model (reference — build this first, in your head, before touching code)

```
Category (1) ───< (many) Product
Customer (1) ───< (many) Order
Order    (1) ───< (many) OrderItem >─── (many) Product
```

| Entity    | Fields                                                |
| --------- | ----------------------------------------------------- |
| Category  | Id, Name                                              |
| Product   | Id, Name, Price, StockQuantity, CategoryId (FK)       |
| Customer  | Id, Name, Email                                       |
| Order     | Id, CustomerId (FK), OrderDate, Status                |
| OrderItem | Id, OrderId (FK), ProductId (FK), Quantity, UnitPrice |

`OrderItem` is the join entity that turns Order↔Product into a proper many-to-many with extra data (quantity, price-at-time-of-order) — this is the piece that makes the project "real" instead of a toy CRUD.

---

## Day 1 — Project Setup + Models + DbContext

### Build

1. `dotnet new webapi -n InventoryApi` — scaffolds the project.
2. Add NuGet packages: `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.EntityFrameworkCore.Design`.
3. Create the folder structure:
   ```
   /Models        → Category.cs, Product.cs, Customer.cs, Order.cs, OrderItem.cs
   /Data          → AppDbContext.cs
   /Controllers   → (empty for now)
   /DTOs          → (empty for now)
   ```
4. Write the 5 entity classes from the table above as plain C# classes with navigation properties (e.g. `Product` has `public Category Category { get; set; }` and `public int CategoryId { get; set; }`).
5. Write `AppDbContext : DbContext` with a `DbSet<T>` for each entity.
6. Add your SQL Server connection string to `appsettings.json`, register the DbContext in `Program.cs` via `builder.Services.AddDbContext<AppDbContext>(...)`.
7. Run `dotnet ef migrations add InitialCreate`, then `dotnet ef database update`.

### How this works internally (learning)

- **Navigation properties** (`Category Category` on `Product`) are how EF Core detects relationships at compile time — it inspects your classes via reflection and builds a model of your schema from them. You're not writing SQL; you're describing an object graph, and EF derives the relational structure from it.
- **A migration is a diff, not a snapshot.** `dotnet ef migrations add` compares your current model against the last migration's snapshot and generates a C# file with `Up()`/`Down()` methods containing the actual `CREATE TABLE` / `ALTER TABLE` SQL. `database update` runs the pending migrations against your real database. This is why migrations are checked into git — they're your schema's version history.
- **`AddDbContext` registers your context for Dependency Injection** with a scoped lifetime — meaning one `AppDbContext` instance per HTTP request. This matters: it's why you don't manually `new` up a DbContext in a controller, you take it as a constructor parameter and the framework hands you the right instance.

### Checkpoint

Run the app, check the database in SQL Server Object Explorer (or Azure Data Studio) — you should see 5 real tables with foreign keys already wired up, before writing a single endpoint.

---

## Day 2 — Controllers + Basic CRUD (Products, Categories)

### Build

1. Create `DTOs/ProductDto.cs` (what the API returns) — **don't return your EF entities directly.**
2. Create `ProductsController` with:
   - `GET /api/products` → list all
   - `GET /api/products/{id}` → single, 404 if missing
   - `POST /api/products` → create, return 201 + Location header
   - `PUT /api/products/{id}` → update, 404 if missing
   - `DELETE /api/products/{id}` → delete, 204 on success
3. Repeat the same 5 endpoints for `CategoriesController`.
4. Inject `AppDbContext` into each controller via constructor.
5. Use `async`/`await` with `ToListAsync()`, `FindAsync()`, `SaveChangesAsync()` throughout — not the sync versions.

### How this works internally (learning)

- **Why DTOs, not entities:** if you return a `Product` directly, EF's lazy-loading proxies or the navigation properties can cause serialization to try to walk `Product → Category → Products → Category → ...` in a circular loop, and you also leak internal fields you never meant to expose. A DTO is a plain shape you control explicitly.
- **`[ApiController]` + model binding:** when a request hits `POST /api/products` with a JSON body, ASP.NET Core's model binder deserializes the JSON into your DTO parameter automatically, and `[ApiController]` makes invalid models auto-return 400 before your method body even runs, based on Data Annotations (`[Required]`, `[Range]`, etc.) on the DTO.
- **Why `async`:** each `await` frees the thread to handle other requests while waiting on the database I/O — this is what lets a small API handle many concurrent requests without a thread per request. Using sync EF calls (`ToList()` instead of `ToListAsync()`) blocks a thread for the entire DB round-trip for no reason.

### Checkpoint

Open Swagger UI (auto-enabled in dev by the webapi template), exercise every endpoint by hand. Confirm 201/404/204 actually show up, not just 200 everywhere.

---

## Day 3 — Relationships, Orders, and the "real" LINQ queries

### Build

1. `OrdersController`:
   - `POST /api/orders` — accepts a `CreateOrderDto` with `CustomerId` and a list of `{ ProductId, Quantity }`. Inside, look up each product's current price, create the `Order` + `OrderItem` rows in one transaction, and decrement `StockQuantity`.
   - `GET /api/orders/{id}` — returns the order with its items (use `.Include()`).
2. `GET /api/customers/{id}/orders` — nested resource: all orders for one customer.
3. `GET /api/products?category={id}&inStock=true&page=1&pageSize=10` — filtering + pagination built with LINQ `Where`/`Skip`/`Take`.
4. `GET /api/products/low-stock?threshold=5` — a genuinely useful query (`Where(p => p.StockQuantity < threshold)`).

### How this works internally (learning)

- **`.Include()` and the N+1 problem:** without `.Include(o => o.OrderItems)`, accessing `order.OrderItems` either throws (if lazy loading is off, the default in modern EF Core) or triggers a _separate_ database query per order if lazy loading is on. `.Include()` tells EF to generate a single SQL `JOIN` up front. Understanding this is one of the most common EF Core interview questions.
- **LINQ is translated, not executed in C#.** When you write `_context.Products.Where(p => p.StockQuantity < threshold)`, EF Core doesn't pull every product into memory and filter in C# — it translates the _expression tree_ into a parameterized SQL `WHERE` clause and only the matching rows come back from the database. This only happens because you're querying `IQueryable<T>`, not `IEnumerable<T>` — if you call `.ToList()` too early, everything after that point runs in memory instead of SQL. Know this distinction cold.
- **Why the order-creation logic needs a transaction:** creating the `Order`, multiple `OrderItem` rows, and decrementing stock are several separate writes that must all succeed or all fail together — otherwise you can end up with an order that exists but has no items, or stock that's wrong. EF Core wraps `SaveChangesAsync()` in an implicit transaction by default for a single call, but if you're doing this across multiple `SaveChangesAsync()` calls, wrap it explicitly with `_context.Database.BeginTransactionAsync()`.

### Checkpoint

Place an order with 2-3 line items through Swagger, then verify in the database: the `Order` row, the `OrderItem` rows, and the decremented `StockQuantity` on the affected products — all consistent.

---

## Day 4 — Polish, Validation, README

### Build

1. Add Data Annotations or FluentValidation to your DTOs (`[Required]`, `[Range(0, double.MaxValue)]` on Price, etc.) — confirm bad input actually returns 400 with a useful message.
2. Add basic error handling: wrap the order-creation logic so an invalid `ProductId` returns 400, not a 500 crash.
3. Wire the React frontend with TypeScript, Tailwind CSS, and TanStack Query v5 (`Dashboard.tsx`, `Orders.tsx`) with generic polymorphic `<Table<T>>` components and KPI cards.

---

## Day 5 — High-Performance Reporting with Dapper (The Hybrid ORM Pattern)

### Build

1. Add `Dapper` NuGet package: `dotnet add package Dapper`.
2. Create `DTOs/DashboardReportDto.cs`:
   - `DashboardSummaryDto`: `TotalInventoryValue`, `TotalProducts`, `LowStockProducts`, `OutOfStockProducts`, `TotalRevenue`, `TotalOrders`.
   - `TopSellingProductDto`: `ProductId`, `ProductName`, `CategoryName`, `UnitsSold`, `TotalRevenue`.
3. Create `Controllers/ReportsController.cs` injecting `AppDbContext`:
   - `GET /api/reports/summary`: Raw SQL query using `_context.Database.GetDbConnection()` and Dapper's `.QuerySingleOrDefaultAsync<DashboardSummaryDto>()`. Computes overall inventory valuation, revenue, and product counts in one fast round-trip.
   - `GET /api/reports/top-selling?limit=5`: Optimized SQL query joining `Products`, `Categories`, and `OrderItems` with `SUM(oi.Quantity)` and `GROUP BY` via Dapper's `.QueryAsync<TopSellingProductDto>()`.

### How this works internally (learning)

- **The Hybrid CQRS / Data Access Pattern:** Full ORMs like EF Core excel at **Commands** (creating/updating/deleting entities with unit-of-work change tracking, navigation properties, and transactional consistency). But for heavy **Queries** (complex analytical dashboards, multi-table aggregations, and high-frequency reporting), EF Core's change-tracker overhead, expression tree parsing, and query generation can add measurable CPU and memory latency.
- **Why Dapper is faster for reporting:** Dapper is a lightweight micro-ORM written by Stack Overflow engineers. It doesn't track entity state, doesn't generate queries, and doesn't construct LINQ trees. It takes raw SQL, executes it directly on an open `IDbConnection`, and maps columns to C# object properties using dynamic IL (Intermediate Language) generation.
- **Connection management:** When you use `_context.Database.GetDbConnection()`, EF Core shares the underlying ADO.NET connection. Dapper handles opening the connection if closed, and you avoid creating unnecessary duplicate connection pools.

### Checkpoint

Call `GET /api/reports/summary` and `GET /api/reports/top-selling` via Scalar / Swagger. Inspect the SQL executed: observe how simple and direct the query is compared to complex EF Core LINQ group-bys.

---

## Day 6 — Real-Time Inventory & Order Telemetry with SignalR

### Build

1. Create `Hubs/InventoryHub.cs` inheriting from `Microsoft.AspNetCore.SignalR.Hub`.
2. Register SignalR in `Program.cs`:
   - `builder.Services.AddSignalR();`
   - Map endpoint: `app.MapHub<InventoryHub>("/hubs/inventory");`
   - Enable `.AllowCredentials()` on the CORS policy (required for WebSockets authentication / browser negotiation).
3. Inject `IHubContext<InventoryHub>` into `OrdersController`:
   - Inside `CreateOrder`, right after `await transaction.CommitAsync();`, broadcast:
     - `await _hubContext.Clients.All.SendAsync("ReceiveOrderPlaced", order.Id, resultDto.TotalAmount);`
     - Loop through items to broadcast `ReceiveStockUpdate` for each decremented product.
4. Inject `IHubContext<InventoryHub>` into `ProductsController` for product creation, stock restock, and deletion events.
5. On the React frontend:
   - Install `@microsoft/signalr`.
   - Create a connection hook (`useInventorySocket.ts`) that listens to `ReceiveStockUpdate` and `ReceiveOrderPlaced`.
   - On event receipt, automatically invalidate TanStack Query cache:
     `queryClient.invalidateQueries({ queryKey: ['products'] });`
     `queryClient.invalidateQueries({ queryKey: ['orders'] });`

### How this works internally (learning)

- **WebSockets vs Polling vs SSE:** Traditional web apps poll the server every few seconds to check if data changed, generating wasted HTTP requests and server load. SignalR establishes a persistent, duplex TCP connection via **WebSockets** (falling back to Server-Sent Events or Long Polling if WebSockets are blocked by corporate proxies/firewalls).
- **`IHubContext<THub>`:** In ASP.NET Core, hubs are transient and only exist during client invocation. To send messages from a controller or background worker outside the hub lifecycle, you inject `IHubContext<THub>`, allowing your business logic to push messages to connected clients at any moment.
- **Push-based cache invalidation:** Instead of optimistic local guesswork or periodic polling, the frontend lets the server push truth events. TanStack Query refetches the latest server state seamlessly in the background, keeping all active users synchronized without page reloads.

### Checkpoint

Open the React app in two side-by-side browser windows. Place an order or add a product in window A: observe window B update its stock badges, KPI cards, and order lists instantly in real-time.

---

## Day 7 — Creation Modals, CV Integration & Ship It

### Build

1. Implement `CreateProductModal.tsx` and `CreateOrderModal.tsx` in the React frontend:
   - Dynamic product line items, stock cap validation, live subtotal computation, and customer selector.
2. Write the README:
   - What it does, architectural overview (Hybrid ORM + Real-time WebSockets), and how to run locally.
3. Push to GitHub with a clean commit history.
4. Add to your CV's Projects section using the LaTeX entry below.

### LaTeX Resume Project Entry

```latex
\resumeProjectHeading
    {\textbf{InvenTrack} $|$ \emph{C\#, ASP.NET Core 9 Web API, EF Core 9, Dapper, SignalR, React 19, TypeScript, TanStack Query, Tailwind CSS}}{\href{https://github.com/saiefadnan/InvenTrack}{GitHub}}
    \resumeItemListStart
        \resumeItem{Architected an enterprise inventory and order management system with a hybrid data-access layer combining \textbf{Entity Framework Core 9} for transactional write integrity and \textbf{Dapper} for sub-millisecond analytical aggregations and KPI reporting.}
        \resumeItem{Engineered atomic order processing pipelines enforcing strict stock availability checks, snapshot pricing, and transactional isolation (\texttt{BeginTransactionAsync}) to eliminate inventory race conditions.}
        \resumeItem{Implemented real-time bidirectional telemetry using \textbf{SignalR WebSockets}, broadcasting inventory decrements and order notifications to trigger automated client-side cache invalidations via \textbf{TanStack Query v5}.}
        \resumeItem{Developed a modular, type-safe React 19 SPA featuring generic polymorphic tables, interactive modal workflows, and responsive KPI metrics styled with dark-mode Tailwind CSS.}
    \resumeItemListEnd
```

---

### Checkpoint — The Real Interview Defense Questions

Before you consider this project done, answer these out loud, unscripted:

1. **Why did you use DTOs instead of returning entities directly?**
2. **Walk through what happens, step by step, from `POST /api/orders` hitting the server to the response coming back.**
3. **What's the difference between `IQueryable` and `IEnumerable` in your `low-stock` query, and why does it matter?**
4. **Why does `.Include()` matter for the `GET /api/orders/{id}` endpoint, and what is the N+1 problem?**
5. **Why use a Hybrid ORM (EF Core + Dapper)? Why not just use EF Core for everything or Dapper for everything?**
6. **How does SignalR choose its underlying transport protocol (WebSockets vs SSE vs Long Polling), and why is `IHubContext` used in a controller instead of the Hub directly?**
7. **What is snapshot pricing in an Order system, and why is it catastrophic to simply reference `Product.Price` on existing orders?**

If you can answer all seven without checking your code, the project is doing its job — it's not about the repo existing, it's about you being able to defend it with conviction.
