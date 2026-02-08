import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { getComplaints, type Complaint } from "@/lib/complaint-store";

interface StatusDataItem {
    name: string;
    value: number;
    color: string;
}

interface PerformanceDataItem {
    name: string;
    resolved: number;
    pending: number;
    amt: number;
}

export default function AnalyticsPage() {
    const [performanceData, setPerformanceData] = useState<PerformanceDataItem[]>([]);
    const [statusData, setStatusData] = useState<StatusDataItem[]>([]);

    useEffect(() => {
        const all = getComplaints();

        const resolvedCount = all.filter((c: Complaint) => c.status === "Resolved").length;
        const pendingCount = all.filter((c: Complaint) => c.status === "Submitted" || c.status === "In Progress").length;
        const delayedCount = all.filter((c: Complaint) => c.status === "Delayed").length;

        setStatusData([
            { name: 'Resolved', value: resolvedCount, color: '#22c55e' },
            { name: 'Pending', value: pendingCount, color: '#eab308' },
            { name: 'Delayed', value: delayedCount, color: '#ef4444' },
        ]);

        const categories = ["Roads", "Water", "Electricity", "Sanitation"];
        const perf = categories.map((cat: string) => {
            const catComplaints = all.filter((c: Complaint) => c.category && c.category.toLowerCase().includes(cat.toLowerCase()));
            const catResolved = catComplaints.filter((c: Complaint) => c.status === "Resolved").length;
            const catPending = catComplaints.filter((c: Complaint) => c.status !== "Resolved").length;
            return {
                name: cat,
                resolved: catResolved,
                pending: catPending,
                amt: 2000
            };
        });
        setPerformanceData(perf);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white p-4 border-b border-slate-200 sticky top-0 z-10 flex items-center gap-3">
                <Link to="/dashboard/profile">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <span className="block font-semibold text-slate-900">Authority Dashboard</span>
                    <span className="text-xs text-slate-500">City-wide Metrics</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="space-y-0">
                        <CardContent className="p-4 pt-4">
                            <p className="text-xs text-slate-500 font-medium">AVG RESOLUTION TIME</p>
                            <p className="text-2xl font-bold text-slate-900">3.2 Days</p>
                            <span className="text-xs text-green-600 font-medium">↓ 12% vs last week</span>
                        </CardContent>
                    </Card>
                    <Card className="space-y-0">
                        <CardContent className="p-4 pt-4">
                            <p className="text-xs text-slate-500 font-medium">USER SATISFACTION</p>
                            <p className="text-2xl font-bold text-slate-900">4.1/5.0</p>
                            <span className="text-xs text-green-600 font-medium">↑ 0.3 vs last week</span>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Department Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={performanceData}
                                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="resolved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Complaint Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
