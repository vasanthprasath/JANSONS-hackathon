import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AIInsightPanel from "@/components/AIInsightPanel";
import RoleBasedActionButton from "@/components/RoleBasedActionButton";
import PriorityBadge from "@/components/PriorityBadge";

export default function AuthorityDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignedComplaints, setAssignedComplaints] = useState<any[]>([]);
    const [historyComplaints, setHistoryComplaints] = useState<any[]>([]);

    useEffect(() => {
        import("@/lib/complaint-store").then(({ checkOverdueComplaints }) => {
            checkOverdueComplaints();
        });
    }, []);

    useEffect(() => {
        const authorityRoles = ["municipal_officer", "zonal_officer", "admin"];
        if (user && !authorityRoles.includes(user.role)) {
            navigate('/dashboard');
            return;
        }

        import("@/lib/complaint-store").then(({ getComplaints }) => {
            const all = getComplaints();

            const pending = all.filter(c => ["Submitted", "In Progress", "Delayed", "Work Completed"].includes(c.status));

            setAssignedComplaints(pending.map(c => {
                const created = new Date(c.date);
                const now = new Date();
                const diffHours = Math.abs(now.getTime() - created.getTime()) / 36e5;
                const isDelayed = diffHours > 48;

                return {
                    id: c.id,
                    title: c.title,
                    status: c.status,
                    category: c.category,
                    lat: c.lat,
                    lng: c.lng,
                    description: c.description,
                    timeElapsed: `${Math.floor(diffHours)} hours`,
                    isDelayed: isDelayed,
                    isVerificationNeeded: c.status === "Work Completed",
                    priority: c.priorityType
                };
            }));

            const resolved = all.filter(c => c.status === "Resolved");
            setHistoryComplaints(resolved.map((c) => ({
                id: c.id,
                description: c.description,
                resolutionTime: c.resolutionTime || 24,
                status: c.status,
                rating: c.rating || 5
            })));
        });
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-4 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Authority Panel</h1>
                    <p className="text-xs text-slate-500">Resolve assigned grievances</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Official
                </Badge>
            </div>

            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <AIInsightPanel resolvedComplaints={historyComplaints} />
            </div>

            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    Pending Assignments
                    <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 h-5 px-1.5 rounded-full text-[10px]">
                        {assignedComplaints.length}
                    </Badge>
                </h2>

                <div className="grid gap-3">
                    {assignedComplaints.sort((_, b) => (b.isVerificationNeeded ? 1 : -1)).map((c) => (
                        <Card key={c.id} className={cn(
                            "group overflow-hidden border-slate-200 transition-all hover:shadow-md",
                            c.isVerificationNeeded ? "border-l-4 border-l-purple-500 bg-purple-50/10" :
                                c.isDelayed ? "border-l-4 border-l-red-500 bg-red-50/10" :
                                    "hover:border-slate-300"
                        )}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center flex-wrap">
                                        <Badge variant="secondary" className="text-[10px] bg-white border border-slate-200 shadow-sm">{c.category}</Badge>
                                        <PriorityBadge priority={c.priority} size="sm" />
                                        {c.isDelayed && (
                                            <Badge variant="destructive" className="text-[10px] h-5 px-1.5 flex items-center gap-1 animate-pulse">
                                                <Clock className="h-3 w-3" /> Delayed (+{parseInt(c.timeElapsed)}h)
                                            </Badge>
                                        )}
                                        {c.isVerificationNeeded && (
                                            <Badge className="text-[10px] h-5 px-1.5 flex items-center gap-1 bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                                                <AlertCircle className="h-3 w-3" /> Verify Work
                                            </Badge>
                                        )}
                                    </div>
                                    <Badge className={
                                        c.status === "Work Completed" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" :
                                            c.status === "In Progress" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                                                "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    }>
                                        {c.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{c.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 mb-3 line-clamp-2">{c.description}</p>

                                        <div className="flex items-center text-xs text-slate-400 gap-3">
                                            <span className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> 0.8 km</span>
                                            <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {c.timeElapsed}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <RoleBasedActionButton
                                            complaintId={c.id}
                                            status={c.status}
                                            size="sm"
                                            className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {assignedComplaints.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <AlertCircle className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">All caught up!</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">No pending grievances assigned to your zone.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
