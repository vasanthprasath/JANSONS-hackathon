
// Simple LocalStorage based Complaint Store

export type PriorityType = "Emergency" | "Moderate" | "Casual";

export interface Complaint {
    id: string;
    title: string;
    description: string;
    category: string;
    status: "Submitted" | "In Progress" | "Resolved" | "Delayed" | "Work Completed";
    lat: number;
    lng: number;
    date: string; // ISO string
    image?: string;
    timeline: { status: string; date: string; completed: boolean }[];
    resolutionTime?: number; // hours
    rating?: number;
    // Worker Extension
    workerId?: string;
    workerName?: string;
    assignedDate?: string;
    workStartedDate?: string;
    workCompletedDate?: string;
    completedAt?: string;
    resolvedAt?: string;
    workerProofImage?: string;
    workerProofLocation?: { lat: number; lng: number };
    workerRemarks?: string;
    statusRemarks?: string;
    fakeReports?: { reportedBy: string; reason: string; comment: string; date: string }[];
    // Verification Extension
    verificationStatus?: "Pending" | "Verified" | "Rejected";
    verifiedBy?: string;
    rejectionReason?: string;
    // Features Extension
    workDeadline?: string;
    isOverdue?: boolean;
    alertSentAt?: string;
    creditPoints?: number;
    // Priority Extension
    priorityType?: PriorityType;
    // Department Extension
    govtLevel?: "Central" | "State" | "Local";
    department?: string;
    industrialIssueType?: string;
}

const STORAGE_KEY = "janseva_complaints";

import { sendNotification } from "./notifications";

export const determinePriority = (title: string, description: string, category: string): PriorityType => {
    const text = `${title} ${description} ${category}`.toLowerCase();

    const emergencyKeywords = [
        "accident", "fire", "gas leak", "flood", "fallen tree",
        "electric shock", "sewage overflow", "road collapse",
        "water pipeline burst", "burst", "collapse", "danger",
        "hazard", "chemical spill", "factory fire", "industrial gas leak", "explosion",
        "safety risk", "unsafe", "gas leak"
    ];

    const moderateKeywords = [
        "street light", "garbage", "drainage", "water leakage",
        "pothole", "traffic signal", "leak", "blocked",
        "pollution", "waste", "fumes", "banking", "ticket", "staff"
    ];

    if (emergencyKeywords.some(k => text.includes(k))) return "Emergency";
    if (moderateKeywords.some(k => text.includes(k))) return "Moderate";

    return "Casual";
};

export const calculateCreditPoints = (complaint: Complaint): number => {
    let points = 10; // Base points for a genuine complaint

    // Bonus for evidence
    if (complaint.image) points += 5;

    // Bonus for high priority (helping identify urgent issues)
    if (complaint.priorityType === "Emergency") points += 10;
    if (complaint.priorityType === "Moderate") points += 5;

    // Bonus for early reporting (logic based on date if needed, but here simple)
    return points;
};

export const getComplaints = (): Complaint[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse complaints", e);
        return [];
    }
};

export const saveComplaint = (complaint: Complaint) => {
    // Determine priority before saving if not present
    if (!complaint.priorityType) {
        complaint.priorityType = determinePriority(complaint.title, complaint.description, complaint.category);
    }

    // Assign estimated credit points
    complaint.creditPoints = calculateCreditPoints(complaint);

    const complaints = getComplaints();
    complaints.unshift(complaint); // Add to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
};

export const updateComplaintStatus = async (id: string, status: Complaint["status"], additionalData?: Partial<Complaint>) => {
    const complaints = getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
        const original = complaints[index];

        // Validation: If marking as Work Completed, check geo-tag
        if (status === "Work Completed" && additionalData?.workerProofLocation) {
            const dist = calculateDistance(
                original.lat, original.lng,
                additionalData.workerProofLocation.lat, additionalData.workerProofLocation.lng
            );

            // If distance > 500m, log it or flag it (here we just mark it for supervisor)
            if (dist > 0.5) {
                additionalData.workerRemarks = (additionalData.workerRemarks || "") + " [FLAG: Location mismatch detected]";
            }
        }

        const updated = { ...original, status, ...additionalData };
        complaints[index] = updated;

        // Update timeline
        const timelineStep = { status, date: new Date().toISOString(), completed: true };
        complaints[index].timeline.push(timelineStep);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));

        // Trigger Notifications
        if (status === "Resolved") {
            sendNotification("user", `Good news! Your complaint #${id} has been marked as RESOLVED.`, "success", id);
        } else if (status === "In Progress") {
            sendNotification("user", `Work has started on your complaint #${id}.`, "info", id);
            if (updated.workerId) {
                sendNotification("worker", `New task assigned: Complaint #${id}. Please check details.`, "info", id);
            }
        } else if (status === "Work Completed") {
            sendNotification("authority", `Work completed for #${id}. Waiting for verification.`, "success", id);
        } else if (status === "Delayed") {
            sendNotification("admin", `SLA Breach: Complaint #${id} is currently DELAYED.`, "error", id);
        }
    }
};

// Helper to calculate distance in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const getComplaintById = (id: string): Complaint | undefined => {
    const complaints = getComplaints();
    return complaints.find(c => c.id === id);
};

// Utility to check deadlines and send alerts - Call this on dashboard load
export const checkOverdueComplaints = async () => {
    if (typeof window === "undefined") return;

    const complaints = getComplaints();
    let updated = false;
    const now = new Date();

    complaints.forEach(c => {
        // Check if deadline exists and not already resolved/completed
        if (c.workDeadline &&
            !["Work Completed", "Resolved", "Rejected"].includes(c.status) &&
            !c.isOverdue) {

            const deadline = new Date(c.workDeadline);
            if (now > deadline) {
                // Mark as overdue
                c.isOverdue = true;
                c.alertSentAt = now.toISOString();

                // Update status if needed
                if (c.status === "In Progress" || c.status === "Submitted") {
                    c.status = "Delayed";
                    c.timeline.push({
                        status: "Delayed",
                        date: now.toISOString(),
                        completed: true
                    });
                }

                updated = true;

                // Send Alerts
                if (c.workerId) {
                    sendNotification("worker", `URGENT: Task #${c.id} is Overdue! Please complete immediately.`, "error", c.id);
                }
                sendNotification("authority", `Alert: Task #${c.id} has breached deadline. Worker: ${c.workerId || 'Unassigned'}`, "warning", c.id);
            }
        }
    });

    if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    }
};
