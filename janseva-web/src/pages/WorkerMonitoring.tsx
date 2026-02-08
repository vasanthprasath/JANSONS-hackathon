import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getComplaints } from "@/lib/complaint-store";
import { getWorkers, type WorkerProfile } from "@/lib/worker-store";

interface WorkerStats extends WorkerProfile {
    completed: number;
    inProgress: number;
    rejected: number;
    fakeReports: number;
    avgTime: string;
}

export default function WorkerMonitoringPage() {
    const [stats, setStats] = useState<WorkerStats[]>([]);

    useEffect(() => {
        const all = getComplaints();
        const realWorkers = getWorkers();

        const workerStats = realWorkers.map(worker => {
            const tasks = all.filter(c => c.workerId === worker.id);
            const completedCount = tasks.filter(c => c.status === "Resolved" && c.verificationStatus === "Verified").length;
            const inProgressCount = tasks.filter(c => c.status === "In Progress" || c.status === "Work Completed").length;
            const rejectedCount = tasks.filter(c => c.verificationStatus === "Rejected").length;
            const fakeReportsCount = tasks.reduce((sum, task) => sum + (task.fakeReports?.length || 0), 0);

            const avgTime = completedCount > 0 ? "24h" : "N/A";

            return {
                ...worker,
                completed: completedCount,
                inProgress: inProgressCount,
                rejected: rejectedCount,
                fakeReports: fakeReportsCount,
                avgTime
            };
        });
        setStats(workerStats);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3">
                <Link to="/dashboard/authority">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <span className="block font-semibold text-slate-900">Worker Monitoring</span>
                    <span className="text-xs text-slate-500">Performance & Accountability</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-bold text-slate-900">{stats.reduce((a, b) => a + b.completed, 0)}</div>
                            <div className="text-xs text-slate-500 uppercase font-medium mt-1">Total Jobs Done</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.reduce((a, b) => a + b.fakeReports, 0)}</div>
                            <div className="text-xs text-slate-500 uppercase font-medium mt-1">Flagged Reports</div>
                        </CardContent>
                    </Card>
                </div>

                <h3 className="font-semibold text-slate-900 mt-4">Worker List</h3>
                <div className="space-y-3">
                    {stats.map(worker => (
                        <Card key={worker.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100">
                                        <img src={worker.avatar} alt={worker.name} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">{worker.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>ID: {worker.id}</span>
                                            {worker.fakeReports > 0 && (
                                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                                    {worker.fakeReports} Flagged
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-1 py-3 border-t border-slate-100 bg-slate-50/50 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-slate-900">{worker.inProgress}</div>
                                        <div className="text-[10px] text-slate-500">Active</div>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <div className="text-sm font-semibold text-green-600">{worker.completed}</div>
                                        <div className="text-[10px] text-slate-500">Done</div>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <div className="text-sm font-semibold text-red-600">{worker.rejected}</div>
                                        <div className="text-[10px] text-slate-500">Rejected</div>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <div className="text-sm font-bold text-slate-900">{worker.avgTime}</div>
                                        <div className="text-[10px] text-slate-500">Avg Time</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
