import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getComplaintById, updateComplaintStatus } from "@/lib/complaint-store";
import { getWorkers } from "@/lib/worker-store";
import type { WorkerProfile } from "@/lib/worker-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, MapPin, CheckCircle2, XCircle, HardHat, Camera } from "lucide-react";
import PriorityBadge from "@/components/PriorityBadge";
import { Link } from "react-router-dom";

export default function ResolvePage() {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState<any>(null);
    const [workers, setWorkers] = useState<WorkerProfile[]>([]);
    const [selectedWorker, setSelectedWorker] = useState("");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const data = getComplaintById(id);
        if (data) {
            setComplaint(data);
            if (data.workDeadline) setDeadline(data.workDeadline.split('T')[0]);
            if (data.workerId) setSelectedWorker(data.workerId);
        }
        setWorkers(getWorkers());
    }, [id]);

    const handleAssign = async () => {
        if (!selectedWorker || !deadline) return;
        setLoading(true);
        const worker = workers.find(w => w.id === selectedWorker);
        await updateComplaintStatus(id, "In Progress", {
            workerId: selectedWorker,
            workerName: worker?.name,
            workDeadline: new Date(deadline).toISOString()
        });
        setSuccess(true);
        setTimeout(() => navigate("/dashboard/authority"), 1500);
    };

    const handleVerifyResolved = async (verified: boolean) => {
        setLoading(true);
        if (verified) {
            await updateComplaintStatus(id, "Resolved", {
                verificationStatus: "Verified",
                resolvedAt: new Date().toISOString()
            });
        } else {
            await updateComplaintStatus(id, "In Progress", {
                verificationStatus: "Rejected",
                statusRemarks: "Work rejected by officer. Please redo with correct evidence."
            });
        }
        setSuccess(true);
        setTimeout(() => navigate("/dashboard/authority"), 1500);
    };

    if (!complaint) return <div className="p-10 text-center">Loading grievance details...</div>;

    const isPendingAssignment = complaint.status === "Submitted";
    const isUnderVerification = complaint.status === "Work Completed";

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/dashboard/authority">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Resolve Grievance</h1>
            </div>

            {success && (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Action successful! Redirecting...</span>
                </div>
            )}

            <Card className="border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100 capitalize">
                            {complaint.category}
                        </Badge>
                        <PriorityBadge priority={complaint.priorityType} />
                    </div>
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed mt-2">
                        {complaint.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 border-t border-slate-50 mt-2">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{complaint.location || 'Location Not Specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User className="h-3.5 w-3.5" />
                            <span>ID: {complaint.id}</span>
                        </div>
                    </div>

                    {complaint.image && (
                        <div className="rounded-lg overflow-hidden border border-slate-200 mt-2">
                            <img src={complaint.image} alt="Evidence" className="w-full h-48 object-cover" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Sections */}
            {isPendingAssignment && (
                <Card className="border-blue-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <HardHat className="h-5 w-5 text-blue-600" />
                            Assign Field Worker
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="worker">Select Worker</Label>
                            <select
                                id="worker"
                                className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500"
                                value={selectedWorker}
                                onChange={(e: any) => setSelectedWorker(e.target.value)}
                            >
                                <option value="">Select a worker...</option>
                                {workers.map(w => (
                                    <option key={w.id} value={w.id}>{w.name} ({w.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Set Resolution Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e: any) => setDeadline(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
                            disabled={!selectedWorker || !deadline || loading}
                            onClick={handleAssign}
                        >
                            {loading ? "Assigning..." : "Assign Task"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isUnderVerification && (
                <Card className="border-purple-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                            <CheckCircle2 className="h-5 w-5" />
                            Verify Resolution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="text-sm font-medium flex items-center gap-2">
                                <Camera className="h-4 w-4 text-slate-500" />
                                Worker Submission Proof
                            </div>
                            {complaint.workerProofImage ? (
                                <img src={complaint.workerProofImage} alt="Completion Proof" className="w-full rounded-lg border border-slate-200" />
                            ) : (
                                <div className="p-10 bg-slate-100 rounded-lg text-center text-slate-500 text-xs">No completion photo provided</div>
                            )}
                            {complaint.workerRemarks && (
                                <div className="p-3 bg-slate-50 rounded text-xs text-slate-600 italic border-l-4 border-slate-300">
                                    Worker Insight: "{complaint.workerRemarks}"
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" disabled={loading} onClick={() => handleVerifyResolved(false)}>
                                <XCircle className="mr-2 h-4 w-4" /> Reject Work
                            </Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading} onClick={() => handleVerifyResolved(true)}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Close
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* If neither, show view only */}
            {!isPendingAssignment && !isUnderVerification && (
                <Card className="bg-slate-100/50 border-0">
                    <CardContent className="p-4 text-center">
                        <p className="text-sm text-slate-500">
                            This grievance is currently <strong>{complaint.status}</strong>.
                            {complaint.workerName && ` Assigned to ${complaint.workerName}.`}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
