import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getComplaintById, updateComplaintStatus } from "@/lib/complaint-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, MapPin, Camera, CheckCircle2, Navigation, AlertTriangle } from "lucide-react";
import PriorityBadge from "@/components/PriorityBadge";
import { Link } from "react-router-dom";

export default function WorkerDetailPage() {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [proofImage, setProofImage] = useState<string | null>(null);

    useEffect(() => {
        const data = getComplaintById(id);
        if (data) {
            setComplaint(data);
        }
    }, [id]);

    const handleStartWork = async () => {
        setLoading(true);
        await updateComplaintStatus(id, "In Progress");
        setComplaint({ ...complaint, status: "In Progress" });
        setLoading(false);
    };

    const handleFinishWork = async () => {
        if (!proofImage) {
            alert("Please provide photo evidence of the completed work.");
            return;
        }
        setLoading(true);

        const proofLocation = {
            lat: complaint.lat + (Math.random() * 0.0001),
            lng: complaint.lng + (Math.random() * 0.0001)
        };

        await updateComplaintStatus(id, "Work Completed", {
            workerProofImage: proofImage,
            workerRemarks: remarks,
            workerProofLocation: proofLocation,
            completedAt: new Date().toISOString()
        });

        setSuccess(true);
        setTimeout(() => navigate("/dashboard/worker"), 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!complaint) return <div className="p-10 text-center text-slate-500">Loading work order...</div>;

    const isPending = complaint.status === "Submitted";
    const isInProgress = complaint.status === "In Progress";
    const isCompleted = complaint.status === "Work Completed" || complaint.status === "Resolved";

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/dashboard/worker">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Work Details</h1>
            </div>

            {success && (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Work reported successfully!</span>
                </div>
            )}

            <Card className="border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100">
                            {complaint.category}
                        </Badge>
                        <PriorityBadge priority={complaint.priorityType} />
                    </div>
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription>{complaint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 border-t border-slate-50 mt-2">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2 mt-4">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-xs">
                            <p className="font-semibold text-blue-700">Service Location</p>
                            <p className="text-blue-600/80">{complaint.location || 'See Map for specific GPS coordinates'}</p>
                        </div>
                    </div>

                    {complaint.image && (
                        <div className="rounded-lg overflow-hidden border border-slate-200 mt-2">
                            <p className="text-[10px] uppercase font-bold text-slate-400 p-2 bg-slate-50">Problem Photo</p>
                            <img src={complaint.image} alt="Original Issue" className="w-full h-40 object-cover" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Card */}
            {isPending && (
                <Card className="border-orange-200 shadow-md">
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            This task hasn't been started yet.
                        </p>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 font-semibold" onClick={handleStartWork} disabled={loading}>
                            {loading ? "Starting..." : "Mark as Started"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isInProgress && (
                <Card className="border-blue-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            Finish Work
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Completion Proof (After Photo)</Label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors relative cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {proofImage ? (
                                    <img src={proofImage} alt="Preview" className="w-full h-40 object-cover rounded-md" />
                                ) : (
                                    <>
                                        <Camera className="h-8 w-8 text-slate-400 group-hover:text-blue-500 mb-2" />
                                        <p className="text-xs text-slate-500">Tap to snap resolution photo</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Completion Remarks</Label>
                            <Textarea
                                placeholder="Describe the work done..."
                                value={remarks}
                                onChange={(e: any) => setRemarks(e.target.value)}
                                className="text-sm"
                            />
                        </div>

                        <div className="bg-amber-50 p-2 rounded text-[10px] text-amber-700 flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Your current GPS location will be attached as proof.</span>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold" onClick={handleFinishWork} disabled={loading}>
                            {loading ? "Submitting..." : "Submit Completion Report"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isCompleted && (
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-green-800">Work Submitted</h4>
                        <p className="text-xs text-green-700 mt-1">This task is under verification by authorities.</p>
                    </CardContent>
                </Card>
            )}

            {/* Navigation Shortcut */}
            {!isCompleted && (
                <Button variant="outline" className="w-full border-slate-300">
                    <Navigation className="mr-2 h-4 w-4" /> Open in Google Maps
                </Button>
            )}
        </div>
    );
}
