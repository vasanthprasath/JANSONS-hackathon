import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import ComplaintMap from "@/components/ComplaintMap";

export default function MapViewPage() {
    const [mapComplaints, setMapComplaints] = useState<any[]>([]);

    useEffect(() => {
        import("@/lib/complaint-store").then(({ getComplaints }) => {
            const all = getComplaints();
            setMapComplaints(all.map((c: any) => ({
                id: c.id,
                title: c.title,
                status: c.status,
                category: c.category,
                lat: c.lat,
                lng: c.lng,
                description: c.description
            })));
        });
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Floating Header */}
            <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-slate-900">Grievance Map</h1>
                    <p className="text-xs text-slate-500">{mapComplaints.length} active issues</p>
                </div>
                <Link to="/dashboard">
                    <Button size="sm" variant="ghost">Back</Button>
                </Link>
            </div>

            {/* Map Container */}
            <div className="flex-1 h-screen w-full relative z-0">
                <ComplaintMap complaints={mapComplaints} />
            </div>

            {/* Legend styled floating card */}
            <div className="absolute bottom-24 left-4 right-4 z-[400]">
                <Card className="bg-white/95 backdrop-blur shadow-xl border-slate-200 overflow-x-auto">
                    <CardContent className="p-3 flex gap-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs font-medium">In Progress</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs font-medium">Submitted</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs font-medium">Resolved</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs font-medium">Delayed</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
