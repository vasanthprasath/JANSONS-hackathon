import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, PlusCircle, ListChecks, User, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpModal } from "@/components/HelpModal";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout() {
    const location = useLocation();
    const pathname = location.pathname;
    const { user } = useAuth();

    const allNavItems = [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/dashboard/create", label: "Report", icon: PlusCircle, roles: ["citizen"] },
        { href: "/dashboard/authority", label: "Panel", icon: ShieldAlert, roles: ["municipal_officer", "zonal_officer", "admin"] },
        { href: "/dashboard/worker", label: "Work", icon: ListChecks, roles: ["worker"] },
        { href: "/dashboard/track", label: "Activity", icon: ListChecks, roles: ["citizen"] },
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ];

    const navItems = allNavItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            <HelpModal />
            <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                <Outlet />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-10 transition-colors">
                <nav className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <div className={cn(
                                    "p-1 rounded-xl transition-all",
                                    isActive && "bg-blue-50 dark:bg-blue-900/30"
                                )}>
                                    <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
