import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, MapPin, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const emailLower = email.toLowerCase();

            if (emailLower.includes("worker")) {
                login(email, "worker");
                navigate("/dashboard/worker");
            } else if (emailLower.includes("admin")) {
                login(email, "admin");
                navigate("/dashboard/authority");
            } else if (emailLower.includes("muni")) {
                login(email, "municipal_officer");
                navigate("/dashboard/authority");
            } else if (emailLower.includes("zonal")) {
                login(email, "zonal_officer");
                navigate("/dashboard/authority");
            } else {
                login(email || "citizen@example.com", "citizen");
                navigate("/dashboard");
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex min-h-full items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                        <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enter your credentials to access your grievance portal account
                    </p>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Sign in to track your complaints
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email / User ID</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="name@example.com or admin ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="#" className="text-xs text-blue-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-4">
                        <p className="text-xs text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span>Made for <span className="font-medium text-slate-600 dark:text-slate-300">Jansons Hackathon</span></span>
                </div>
            </div>
        </div>
    );
}
