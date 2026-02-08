"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "citizen" | "worker" | "municipal_officer" | "zonal_officer" | "admin";

export interface AuthorityDetails {
    position: string;
    department?: string;
    jurisdiction?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    authorityDetails?: AuthorityDetails;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check local storage for session
        const storedUser = localStorage.getItem("janseva_user");
        if (storedUser) {
            // Delay to avoid 'synchronous setState in effect' warning
            setTimeout(() => {
                setUser(JSON.parse(storedUser));
            }, 0);
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: UserRole) => {
        // Login logic with specific roles
        const id = Math.random().toString(36).substr(2, 9);
        let authorityDetails: AuthorityDetails | undefined;

        if (role === "admin") {
            authorityDetails = {
                position: "District Administrator",
                jurisdiction: "All Districts",
                department: "Central Admin"
            };
        } else if (role === "municipal_officer") {
            authorityDetails = {
                position: "Municipal Officer",
                jurisdiction: "Zone 1",
                department: "Urban Development"
            };
        } else if (role === "zonal_officer") {
            authorityDetails = {
                position: "Zonal Officer",
                jurisdiction: "Zone 5 (North)",
                department: "Operations"
            };
        }

        const newUser: User = {
            id,
            name: email.split("@")[0],
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            authorityDetails
        };
        setUser(newUser);
        localStorage.setItem("janseva_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("janseva_user");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
