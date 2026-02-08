"use client";

export interface WorkerProfile {
    id: string; // usually email or generated id
    name: string;
    email: string;
    role: "worker";
    registeredAt: string;
    status: "Active" | "Pending Assignment";
    avatar: string;
}

const STORAGE_KEY = "janseva_workers";

export const getWorkers = (): WorkerProfile[] => {
    if (typeof window === "undefined") return [];

    // Check local storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse workers", e);
        }
    }

    return [];
};

export const registerWorker = (name: string, email: string) => {
    const workers = getWorkers();

    // Check if duplicate
    if (workers.some(w => w.email === email)) {
        return; // Already registered
    }

    const newWorker: WorkerProfile = {
        id: email, // Use email as ID for simplicity in this demo or generate UUID
        name,
        email,
        role: "worker",
        registeredAt: new Date().toISOString(),
        status: "Active",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    workers.push(newWorker);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
};
