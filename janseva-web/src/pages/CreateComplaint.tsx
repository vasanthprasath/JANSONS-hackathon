import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Camera, X } from "lucide-react";

import { saveComplaint, type Complaint } from "@/lib/complaint-store";

export default function CreateComplaintPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role !== "citizen") {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [scope, setScope] = useState<"Central" | "State" | "Local" | "Industrial">("Local");
    const [department, setDepartment] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const departmentsByScope = {
        "Central": [
            "Banking & Financial Services",
            "Railway & Train Ticket Booking",
            "Passport & Identity Services",
            "National Transport & Highways"
        ],
        "State": [
            "Land & Property Registration",
            "Public Hospitals & Education",
            "Public Restroom & Sanitation",
            "Document / Paper Registration",
            "State Transport Services"
        ],
        "Local": [
            "Roads & Potholes",
            "Sanitation & Garbage",
            "Water Supply",
            "Electricity",
            "Public Restroom",
            "Government Staff Complaints"
        ],
        "Industrial": [
            "Factory Pollution (Air / Water / Noise)",
            "Industrial Safety Risks",
            "Factory Fire Hazards",
            "Chemical Waste Disposal",
            "Industrial Gas Leakage",
            "Illegal Industrial Operations",
            "Environmental Damage"
        ]
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let lat = 12.9716;
        let lng = 77.5946;

        try {
            if (location.includes(",")) {
                const parts = location.split(",");
                lat = parseFloat(parts[0].replace(/[^0-9.]/g, ""));
                lng = parseFloat(parts[1].replace(/[^0-9.]/g, ""));
            }
        } catch (e) { console.error("Loc parse error", e) }

        setTimeout(async () => {
            const newId = "CMP-" + Math.floor(Math.random() * 100000);

            const descriptionElement = document.getElementById('description') as HTMLTextAreaElement;

            let finalCategory = department;
            let finalDept = department;
            let finalGovtLevel: "Central" | "State" | "Local" = scope === "Industrial" ? "State" : scope;
            let finalIssueType = undefined;

            if (scope === "Industrial") {
                finalCategory = "Industrial";
                finalDept = "Industrial";
                finalIssueType = department;
            } else if (scope === "Local") {
                finalCategory = ["Roads & Potholes", "Sanitation & Garbage", "Water Supply", "Electricity"].some(d => department.includes(d)) ?
                    department : department || "Other";
            } else {
                finalCategory = department || "Other";
            }

            const description = descriptionElement ? descriptionElement.value : "No description";
            const title = scope === "Industrial" ? `Industrial Risk - ${department}` : `${scope} - ${department} Issue`;

            const newComplaint: Complaint = {
                id: newId,
                title: title,
                description: description,
                category: finalCategory,
                status: "Submitted",
                lat: lat,
                lng: lng,
                date: new Date().toISOString(),
                image: image || undefined,
                govtLevel: finalGovtLevel,
                department: finalDept,
                industrialIssueType: finalIssueType,
                timeline: [
                    { status: "Submitted", date: new Date().toISOString(), completed: true },
                    { status: "In Progress", date: "", completed: false },
                    { status: "Resolved", date: "", completed: false }
                ]
            };

            saveComplaint(newComplaint);
            navigate(`/dashboard/track/${newId}?new=true`);
        }, 1500);
    };

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
            }, (error) => {
                console.error("Error getting location:", error);
                setLocation("12.9716° N, 77.5946° E");
            });
        } else {
            setLocation("12.9716° N, 77.5946° E");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">New Complaint</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Provide details about the issue you are facing.
                </p>
            </div>

            {!isMounted ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-300 dark:text-slate-600" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scope">Governance Level</Label>
                            <select
                                id="scope"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                                required
                                value={scope}
                                onChange={(e) => {
                                    setScope(e.target.value as any);
                                    setDepartment("");
                                }}
                            >
                                <option value="Local">Local / Municipal</option>
                                <option value="State">State Government</option>
                                <option value="Central">Central Government</option>
                                <option value="Industrial">Industrial Board</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department / Issue Type</Label>
                            <select
                                id="department"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departmentsByScope[scope].map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="flex gap-2">
                            <Input
                                id="location"
                                placeholder="Enter location or use GPS"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={getLocation}>
                                <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the issue in detail..."
                            className="min-h-[120px] bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Evidence (Optional)</Label>
                        {image ? (
                            <div className="relative rounded-lg overflow-hidden h-40 border border-slate-200 dark:border-slate-700">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-2 text-slate-400" />
                                        <p className="text-sm text-slate-500">Click to upload photo</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full h-11 text-lg" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Complaint
                    </Button>
                </form>
            )}
        </div>
    );
}
