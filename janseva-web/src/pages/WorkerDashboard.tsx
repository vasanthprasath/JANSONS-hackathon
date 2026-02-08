import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase } from "lucide-react";
import RoleBasedActionButton from "@/components/RoleBasedActionButton";
import PriorityBadge from "@/components/PriorityBadge";

export default function WorkerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "worker") {
            if (user?.role !== "worker") navigate("/dashboard");
            return;
        }

        import("@/lib/complaint-store").then(({ getComplaints }) => {
            const all = getComplaints();
            const myTasks = all.filter(c => c.workerId === user.id);
            setAssignments(myTasks);
            setLoading(false);
        });
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
                    <p className="text-sm text-slate-500">Tasks assigned to you</p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Briefcase className="h-5 w-5" />
                </div>
            </div>

            <div className="space-y-4">
                {assignments.length === 0 && !loading && (
                    <Card className="border-dashed border-2 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <Briefcase className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="font-medium text-slate-900">No Active Assignments</h3>
                            <p className="text-xs text-slate-500 max-w-[200px] mt-1">
                                You have no pending work orders. Check back later or contact supervisor.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {assignments.map(task => (
                    <Card key={task.id} className="overflow-hidden border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex gap-2">
                                    <Badge variant="outline">{task.category}</Badge>
                                    <PriorityBadge priority={task.priorityType} size="sm" />
                                </div>
                                <Badge className={
                                    task.status === "Work Completed" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                                        task.status === "In Progress" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                            "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                }>
                                    {task.status === "Submitted" ? "Pending Start" : task.status === "Work Completed" ? "Pending Verification" : task.status}
                                </Badge>
                            </div>
                            <CardTitle className="text-base text-slate-900">{task.title}</CardTitle>
                            <CardDescription className="line-clamp-1">{task.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Assigned: {task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>Location View</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <RoleBasedActionButton
                                    complaintId={task.id}
                                    status={task.status}
                                    fullWidth={true}
                                    className="bg-slate-900 hover:bg-slate-800"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
