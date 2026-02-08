import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface RoleBasedActionButtonProps {
    complaintId: string;
    status: string;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    fullWidth?: boolean;
}

export default function RoleBasedActionButton({
    complaintId,
    status,
    className = "",
    size = "default",
    variant = "default",
    fullWidth = false
}: RoleBasedActionButtonProps) {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading || !user) return null;

    const role = user.role;
    if (role === "citizen") return null;

    const normalizedStatus = status.toLowerCase();

    let href = "";
    let label = "Manage";

    if (role === "worker") {
        href = `/dashboard/worker/${complaintId}`;

        if (["in progress", "in_progress"].includes(normalizedStatus)) {
            label = "Finish Work";
        } else if (normalizedStatus === "submitted") {
            label = "View Assignment";
        } else {
            label = "View Details";
        }
    }
    else if (["admin", "municipal_officer", "zonal_officer"].includes(role)) {
        href = `/dashboard/authority/resolve/${complaintId}`;

        if (["work completed", "work_completed"].includes(normalizedStatus)) {
            label = "Verify Work";
        } else if (normalizedStatus === "submitted") {
            label = "Assign Worker";
        } else {
            label = "Manage Content";
        }
    }

    if (!href) return null;

    return (
        <Link to={href} className={fullWidth ? "w-full" : ""}>
            <Button size={size} variant={variant} className={`${className} ${fullWidth ? "w-full" : ""}`}>
                {label} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
    );
}
