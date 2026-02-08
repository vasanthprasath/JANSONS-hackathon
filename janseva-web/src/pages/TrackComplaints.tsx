import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RoleBasedActionButton from "@/components/RoleBasedActionButton";
import PriorityBadge from "@/components/PriorityBadge";
import { FakeReportDialog } from "@/components/FakeReportDialog";

export default function TrackComplaintsPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = () => {
        import("@/lib/complaint-store").then(({ getComplaints }) => {
            const all = getComplaints();
            setComplaints(all.map(c => ({
                id: c.id,
                title: c.title,
                status: c.status,
                category: c.category,
                priority: c.priorityType,
                date: new Date(c.date).toLocaleDateString()
            })));
            setLoading(false);
        });
    }

    useEffect(() => {
        refreshData();
    }, []);

    const handleFakeReport = async (id: string, reason: string, comment: string) => {
        const { updateComplaintStatus } = await import("@/lib/complaint-store");
        await updateComplaintStatus(id, "In Progress", {
            verificationStatus: "Rejected",
            workerRemarks: `[CITIZEN REPORT: ${reason}] ${comment}`
        });
        refreshData();
    };

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">Your Activity</h1>
                <p className="text-sm text-slate-500">
                    Track the status of your reported grievances.
                </p>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search complaints..."
                        className="pl-9 bg-white"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-slate-400 text-sm">Loading...</div>
                ) : complaints.length > 0 ? (
                    complaints.map((c) => (
                        <Card key={c.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-3">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">
                                            {c.category}
                                        </Badge>
                                        <PriorityBadge priority={c.priority} size="sm" />
                                    </div>
                                    <Badge variant={
                                        c.status === 'Resolved' ? 'success' :
                                            c.status === 'In Progress' ? 'default' :
                                                c.status === 'Delayed' ? 'destructive' : 'secondary'
                                    } className="text-[10px]">
                                        {c.status === "Work Completed" ? "Work completed, under verification" : c.status}
                                    </Badge>
                                </div>
                                <Link to={`/dashboard/track/${c.id}`} className="block">
                                    <h4 className="font-semibold text-slate-900 mb-1 hover:text-blue-600">{c.title}</h4>
                                </Link>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="text-xs text-slate-500">
                                        <div className="mb-0.5">ID: {c.id}</div>
                                        <div>{c.date}</div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <RoleBasedActionButton complaintId={c.id} status={c.status} size="sm" className="h-7 text-xs" />
                                        {c.status === "Work Completed" && (
                                            <div className="flex-1">
                                                <FakeReportDialog
                                                    onReportSubmit={(reason, comment) => handleFakeReport(c.id, reason, comment)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-500">No grievances reported yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Your submissions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
