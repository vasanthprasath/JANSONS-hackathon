"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RoleBasedActionButton from "./RoleBasedActionButton";

// Fix for Leaflet default marker icons in Next.js/Webpack
const createIcon = (color: string) => {
    return L.divIcon({
        className: "custom-marker",
        html: `<div style="
      background-color: ${color};
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Resolved": return "#22c55e"; // green-500
        case "In Progress": return "#3b82f6"; // blue-500
        case "Work Completed": return "#a855f7"; // purple-500
        case "Delayed": return "#ef4444"; // red-500
        default: return "#f59e0b"; // amber-500
    }
};

interface Complaint {
    id: string;
    title: string;
    status: string;
    category: string;
    lat: number;
    lng: number;
    description: string;
}

interface ComplaintMapProps {
    complaints: Complaint[];
}

export default function ComplaintMap({ complaints }: ComplaintMapProps) {
    const { user } = useAuth();
    const isPublic = !user || user.role === "citizen";

    useEffect(() => {
        // Fix map container height if needed override or cleanup
    }, []);

    return (
        <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {complaints.map((c) => (
                <Marker
                    key={c.id}
                    position={[c.lat, c.lng]}
                    icon={createIcon(getStatusColor(c.status))}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                                <Badge className="text-[10px] bg-slate-100 text-slate-800 hover:bg-slate-200 border-0">{c.status}</Badge>
                            </div>
                            <h3 className="font-bold text-sm mb-1">{c.title}</h3>
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{c.description}</p>
                            {isPublic ? (
                                <Link to={`/dashboard/track/${c.id}`}>
                                    <Button size="sm" className="w-full h-7 text-xs">
                                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </Link>
                            ) : (
                                <RoleBasedActionButton
                                    complaintId={c.id}
                                    status={c.status}
                                    size="sm"
                                    className="h-7 text-xs w-full"
                                    fullWidth={true}
                                />
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
