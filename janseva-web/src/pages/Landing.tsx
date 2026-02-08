import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center p-8 text-center h-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-600 rounded-full mb-4"></div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">JanSeva</h1>
        <p className="text-slate-500 dark:text-slate-400">Loading your portal...</p>
      </div>
    </div>
  );
}
