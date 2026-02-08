import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { UserPlus, Loader2 } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWorker, setIsWorker] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isWorker) {
            const { registerWorker } = await import("@/lib/worker-store");
            registerWorker(name, email);
            setTimeout(() => {
                login(email, "worker");
                navigate("/dashboard/worker");
                setLoading(false);
            }, 1000);
        } else {
            // Simulate API delay
            setTimeout(() => {
                login(email, "citizen");
                navigate("/dashboard");
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="flex min-h-full items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="rounded-full bg-blue-100 p-3">
                        <UserPlus className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Create an account
                    </h1>
                    <p className="text-sm text-slate-500">
                        Join JanSeva to report and track issues
                    </p>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Create an account to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="worker-mode"
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                    checked={isWorker}
                                    onChange={(e) => setIsWorker(e.target.checked)}
                                />
                                <Label htmlFor="worker-mode" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                    Register as Field Worker
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isWorker ? "Register Worker ID" : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-4">
                        <p className="text-xs text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
