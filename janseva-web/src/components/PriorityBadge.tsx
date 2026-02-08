import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface PriorityBadgeProps {
    priority?: "Emergency" | "Moderate" | "Casual";
    size?: "sm" | "default";
}

export default function PriorityBadge({ priority, size = "default" }: PriorityBadgeProps) {
    if (!priority) return null;

    let colorClass = "bg-slate-100 text-slate-700";
    let icon = <Info className="h-3 w-3 mr-1" />;

    switch (priority) {
        case "Emergency":
            colorClass = "bg-red-100 text-red-700 border-red-200 animate-pulse-slow";
            icon = <AlertTriangle className="h-3 w-3 mr-1" />;
            break;
        case "Moderate":
            colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            icon = <AlertCircle className="h-3 w-3 mr-1" />;
            break;
        case "Casual":
            colorClass = "bg-green-100 text-green-700 border-green-200";
            icon = <Info className="h-3 w-3 mr-1" />;
            break;
    }

    const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

    return (
        <Badge variant="outline" className={`${colorClass} ${sizeClass} font-medium border`}>
            {icon}
            {priority}
        </Badge>
    );
}
