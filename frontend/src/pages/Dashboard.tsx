import { useState } from "react";
import StatCard from "../components/StatCard";
import { useDeleteProduct, useLowStockProducts, useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

const Dashboard = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: products = [] } = useProducts({ categoryId: selectedCategory });
    const { data: lowStockProducts = [] } = useLowStockProducts(5);
    const { data: categories = [] } = useCategories();
    const deleteMutation = useDeleteProduct();

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalLowStock = lowStockProducts.length;

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <main className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard title="Total Products" value={totalProducts} subtitle="Across all categories" />
                <StatCard title="Low Stock Items" value={totalLowStock} subtitle="Products running low" variant="warning" />
                <StatCard title="Total Categories" value={totalCategories} subtitle="Across all categories" />
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Products Inventory</h2>
                        <p className="text-sm text-slate-400">Manage your catalog, stock levels, and pricing</p>
                    </div>
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer">+ Add Product</button>
                </div>                
            
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search products by name..." 
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select 
                            value={selectedCategory ?? ""} 
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)} 
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60"> 
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                                            No products found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const isLowStock = p.stockQuantity <= 5;
                                        const isOutOfStock = p.stockQuantity === 0;

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{p.name}</div>
                                                    <div className="text-slate-500 text-xs">ID: #{p.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                        {p.categoryName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-white">${p.price.toFixed(2)}</td>
                                                <td className={`px-6 py-4 font-medium ${isLowStock ? "text-amber-400" : "text-slate-300"}`}>
                                                    {p.stockQuantity} units
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isOutOfStock ? (
                                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                            Out of Stock
                                                        </span>
                                                    ) : isLowStock ? (
                                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium cursor-pointer">Edit</button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        disabled={deleteMutation.isPending}
                                                        className="text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard;