import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getComplaints, checkOverdueComplaints } from "@/lib/complaint-store";

interface RecentComplaintSummary {
    id: string;
    title: string;
    status: string;
    date: string;
}

export default function DashboardHome() {
    const { user } = useAuth();
    const [recentComplaints, setRecentComplaints] = useState<RecentComplaintSummary[]>([]);
    const [statsData, setStatsData] = useState({ pending: 0, resolved: 0, delayed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Background check for overdue tasks
        checkOverdueComplaints();

        const all = getComplaints();

        // Calculate stats
        const pending = all.filter(c => c.status === "Submitted" || c.status === "In Progress").length;
        const resolved = all.filter(c => c.status === "Resolved").length;
        const delayed = all.filter(c => c.status === "Delayed").length;

        setStatsData({ pending, resolved, delayed });

        // Get recent 3
        // If worker, show their assigned tasks
        let displayList = all;
        if (user?.role === "worker") {
            displayList = all.filter(c => c.workerId === user.id);
        }

        setRecentComplaints(displayList.slice(0, 3).map(c => ({
            id: c.id,
            title: c.title,
            status: c.status,
            date: new Date(c.date).toLocaleDateString()
        })));
        setLoading(false);
    }, [user]);

    const stats = [
        { label: "Pending", value: statsData.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Resolved", value: statsData.resolved, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { label: "Delayed", value: statsData.delayed, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    ];

    const isAuthority = ["municipal_officer", "zonal_officer", "admin"].includes(user?.role || "");

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Hello, {user?.name || "Citizen"} 👋</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user?.role === "worker" ? "Ready for field work today?" :
                            isAuthority ? "Monitoring city services" : "Helping you fix your city"}
                    </p>
                </div>
                <Link to="/dashboard/profile">
                    <img
                        src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                        alt="Profile"
                        className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                </Link>
            </div>

            {/* Role-Based Action Banners */}
            {user?.role === "citizen" && (
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 -skew-x-12 transform translate-x-8"></div>
                    <CardContent className="p-6 flex flex-col items-start gap-4 relative z-10">
                        <div>
                            <h3 className="font-semibold text-lg">Spot an issue?</h3>
                            <p className="text-blue-100 text-sm">Report it now and track resolution in real-time.</p>
                        </div>
                        <div className="flex gap-2">
                            <Link to="/dashboard/create">
                                <Button size="sm" variant="secondary" className="font-semibold text-blue-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Complaint
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {user?.role === "worker" && (
                <Card className="bg-gradient-to-r from-orange-500 to-amber-600 border-0 text-white overflow-hidden relative">
                    <CardContent className="p-6 flex flex-col items-start gap-4 relative z-10">
                        <div>
                            <h3 className="font-semibold text-lg">Active Assignments</h3>
                            <p className="text-amber-100 text-sm">Check your work orders and update status on-the-go.</p>
                        </div>
                        <Link to="/dashboard/worker">
                            <Button size="sm" variant="secondary" className="font-semibold text-amber-700">
                                Start Working
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {isAuthority && (
                <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-0 text-white overflow-hidden relative">
                    <CardContent className="p-6 flex flex-col items-start gap-4 relative z-10">
                        <div>
                            <h3 className="font-semibold text-lg">Control Panel</h3>
                            <p className="text-slate-300 text-sm">Review grievances, assign workers, and verify tasks.</p>
                        </div>
                        <div className="flex gap-2">
                            <Link to="/dashboard/authority">
                                <Button size="sm" variant="secondary" className="font-semibold text-slate-800">
                                    Manage Portal
                                </Button>
                            </Link>
                            <Link to="/dashboard/analytics">
                                <Button size="sm" className="bg-slate-700 hover:bg-slate-600 text-white">
                                    City Metrics
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid - Show city-wide for auth, personal/relevant for others */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2">
                        <div className={`p-2 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-10`}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {user?.role === "worker" ? "Your Assigned Tasks" : "Recent Activity"}
                    </h3>
                    <Link to={user?.role === "worker" ? "/dashboard/worker" : "/dashboard/track"} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-6 text-slate-400 text-xs">Loading activity...</div>
                    ) : recentComplaints.length > 0 ? (
                        recentComplaints.map((c) => (
                            <Card key={c.id} className="overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${c.status === 'Resolved' ? 'bg-green-500' : c.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">{c.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{c.id} • {c.date}</p>
                                        </div>
                                    </div>
                                    <Badge variant={c.status === 'Resolved' ? 'success' : 'secondary'} className="text-[10px]">
                                        {c.status}
                                    </Badge>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-400 dark:text-slate-500 text-sm">No activity yet.</p>
                            <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">
                                {user?.role === "worker" ? "Check with your supervisor for tasks." : "Submit your first grievance!"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
