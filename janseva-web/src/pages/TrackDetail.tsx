import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getComplaintById } from "@/lib/complaint-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, CheckCircle2, AlertCircle, Calendar, User } from "lucide-react";
import PriorityBadge from "@/components/PriorityBadge";
import { Link } from "react-router-dom";

export default function TrackDetailPage() {
    const { id } = useParams() as { id: string };
    const [complaint, setComplaint] = useState<any>(null);

    useEffect(() => {
        const data = getComplaintById(id);
        if (data) {
            setComplaint(data);
        }
    }, [id]);

    if (!complaint) return <div className="p-10 text-center text-slate-500">Finding grievance records...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/dashboard/track">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Grievance Detail</h1>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100">
                            {complaint.category}
                        </Badge>
                        <PriorityBadge priority={complaint.priorityType} />
                    </div>
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription className="text-slate-600 mt-2">{complaint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 border-t border-slate-50 mt-2">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(complaint.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{complaint.location || 'Location Captured'}</span>
                        </div>
                    </div>

                    {complaint.image && (
                        <div className="rounded-lg overflow-hidden border border-slate-200 mt-2">
                            <img src={complaint.image} alt="Reported Evidence" className="w-full h-40 object-cover" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Timeline View */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Resolution Timeline
                </h3>

                <div className="relative space-y-8 pl-4 border-l-2 border-slate-200 ml-2 py-4">
                    {complaint.timeline && complaint.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="relative">
                            <div className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-white ${step.completed ? 'bg-blue-600 shadow-[0_0_0_2px_#3b82f644]' : 'bg-slate-300'}`} />
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className={`text-sm font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {step.status === "Work Completed" ? "Under Verification" : step.status}
                                    </h4>
                                    <span className="text-[10px] text-slate-400">{new Date(step.date).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {step.status === "Submitted" ? "Grievance successfully recorded in JanSeva portal." :
                                        step.status === "In Progress" ? "Assigned to field worker for resolution." :
                                            step.status === "Work Completed" ? "Worker has finished the task. Authority verification pending." :
                                                step.status === "Resolved" ? "Work verified and grievance resolved successfully." :
                                                    "Action recorded in the system."}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Next Steps if not resolved */}
                    {complaint.status !== "Resolved" && (
                        <div className="relative opacity-50">
                            <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-200" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-400">Next Action Pending</h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Worker Proof if Completed/Resolved */}
            {(complaint.status === "Work Completed" || complaint.status === "Resolved") && complaint.workerProofImage && (
                <Card className="bg-slate-900 text-white border-0 shadow-lg mt-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-400" /> Resolution Proof
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <img src={complaint.workerProofImage} alt="Completion Proof" className="w-full h-40 object-cover rounded-md border border-slate-700" />
                        {complaint.workerRemarks && (
                            <p className="text-xs text-slate-300 italic p-2 bg-slate-800 rounded">
                                " {complaint.workerRemarks} "
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <User className="h-3 w-3" />
                            <span>Verified by Internal Team via Geo-Tagging</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {complaint.isOverdue && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-red-800">Delayed Resolution</h4>
                        <p className="text-xs text-red-700 mt-1">
                            This grievance has exceeded the expected resolution time. Higher authorities have been alerted.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
