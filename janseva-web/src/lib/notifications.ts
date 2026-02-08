"use client";

// Simple LocalStorage based Notification Store

export interface Notification {
    id: string;
    recipientRole: "authority" | "admin" | "worker" | "user";
    message: string;
    type: "info" | "success" | "warning" | "error";
    relatedComplaintId?: string;
    timestamp: string;
    read: boolean;
}

const STORAGE_KEY = "janseva_notifications";

export const getNotifications = (): Notification[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse notifications", e);
        return [];
    }
};

export const sendNotification = (
    recipientRole: Notification["recipientRole"],
    message: string,
    type: Notification["type"] = "info",
    relatedComplaintId?: string
) => {
    const notifications = getNotifications();
    const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        recipientRole,
        message,
        type,
        relatedComplaintId,
        timestamp: new Date().toISOString(),
        read: false
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const markAsRead = (id: string) => {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
        notifications[index].read = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
};
