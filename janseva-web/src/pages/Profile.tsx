import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, UserCog, Award, Palette } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (user && user.role === "citizen") {
            import("@/lib/complaint-store").then(({ getComplaints }) => {
                const all = getComplaints();
                const resolved = all.filter(c => c.status === "Resolved" || c.resolutionTime);
                const total = resolved.reduce((acc: number, curr: any) => acc + (curr.creditPoints || 10), 0);
                setPoints(total);
            });
        }
    }, [user]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
            </div>

            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                        <img
                            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h2>
                        {["municipal_officer", "zonal_officer", "admin"].includes(user?.role || "") && user?.authorityDetails ? (
                            <div className="space-y-1 mt-1">
                                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{user.authorityDetails.position}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.authorityDetails.department} • {user.authorityDetails.jurisdiction}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {user?.role === "worker" ? "Field Worker" :
                                    user?.role === "citizen" ? "Concerned Citizen" : "JanSeva User"}
                            </p>
                        )}
                        <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium mt-2">
                            ID: {user?.id}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {
                user?.role === "citizen" && (
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-md">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Impact Score</p>
                                <h3 className="text-3xl font-bold">{points} Credits</h3>
                                <p className="text-xs text-white/70 mt-1">earned from validated reports</p>
                            </div>
                            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-200">Settings</h3>
                </div>

                <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">App Theme</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light/dark mode</p>
                            </div>
                        </div>
                        <ModeToggle />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                <UserCog className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">Edit Profile</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Update personal details</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>

            <div className="text-center text-xs text-slate-400 mt-8">
                JanSeva v1.0.0 (Hackathon Build)
            </div>
        </div >
    );
}
