import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-800 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg tracking-tight">InvenTrack</span>
                <span className="text-xs text-slate-400 px-2 rounded-full py-0.5 font-bold border border-slate-700 bg-slate-800">v1.0</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-2"></span>
                <span className="text-xs text-slate-400 font-medium">API Connected</span>
            </div>
            <div className="flex items-center gap-2">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            isActive 
                                ? "bg-slate-800 text-white font-medium" 
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                        }`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink 
                    to="/orders" 
                    className={({ isActive }) => 
                        `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            isActive 
                                ? "bg-slate-800 text-white font-medium" 
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                        }`
                    }
                >
                    Orders
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;