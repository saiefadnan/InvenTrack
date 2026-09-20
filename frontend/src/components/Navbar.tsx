import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between bg-slate-900 px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg tracking-tight">InvenTrack</span>
                <span className="text-xs text-slate-400 px-2 rounded-full py-0.5 font-bold border border-slate-700 bg-slate-800">v1.0</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-400 font-medium">API Connected</span>
            </div>
            <div className="flex items-center gap-10">
                <Link to='/' className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                <Link to='/orders' className="text-slate-300 hover:text-white transition-colors">Orders</Link>
            </div>
        </nav>
    )

}

export default Navbar;