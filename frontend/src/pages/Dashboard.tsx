import StatCard from "../components/StatCard";

const Dashboard = () => {
    return (
        <main className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard title="Total Products" value="1245" subtitle="Across all categories" />
                <StatCard title="Low Stock Items" value="45" subtitle="Products running low" variant="warning" />
                <StatCard title="Total Categories" value="12" subtitle="Across all categories" />
            </div>

            <div className="space-y-4">
                <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Products Inventory</h2>
                        <p className="text-sm text-slate-400">Manage your catalog, stock levels, and pricing</p>
                    </div>
                   <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer">+ Add Product</button>
                </div>                
            
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input type="text" placeholder="Search products by name..." className="w-full bg-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"></input>
                    </div>
                    <div className="w-full sm:w-48">
                        <select className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                            <option value="">All Categories</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div>
                                            Logitech MX Master 3S
                                        </div>
                                        <div>
                                            SKU: LOGI-MX35
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            Electronics
                                        </span>
                                    </td>
                                    <td>$99.99</td>
                                    <td>24 units</td>
                                    <td>In Stock</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>
                                            Logitech MX Master 3S
                                        </div>
                                        <div>
                                            SKU: LOGI-MX35
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            Electronics
                                        </span>
                                    </td>
                                    <td>$99.99</td>
                                    <td>24 units</td>
                                    <td>In Stock</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>
                                            Logitech MX Master 3S
                                        </div>
                                        <div>
                                            SKU: LOGI-MX35
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            Electronics
                                        </span>
                                    </td>
                                    <td>$99.99</td>
                                    <td>24 units</td>
                                    <td>In Stock</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>
                                            Logitech MX Master 3S
                                        </div>
                                        <div>
                                            SKU: LOGI-MX35
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            Electronics
                                        </span>
                                    </td>
                                    <td>$99.99</td>
                                    <td>24 units</td>
                                    <td>In Stock</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>
                                            Logitech MX Master 3S
                                        </div>
                                        <div>
                                            SKU: LOGI-MX35
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            Electronics
                                        </span>
                                    </td>
                                    <td>$99.99</td>
                                    <td>24 units</td>
                                    <td>In Stock</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard;