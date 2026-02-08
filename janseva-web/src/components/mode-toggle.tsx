import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme("light")}
                className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    theme === "light"
                        ? "bg-white text-orange-500 shadow-sm dark:bg-slate-700"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                )}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme("system")}
                className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    theme === "system"
                        ? "bg-white text-blue-500 shadow-sm dark:bg-slate-600 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                )}
                title="System Default"
            >
                <Laptop className="h-4 w-4" />
                <span className="sr-only">System</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme("dark")}
                className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    theme === "dark"
                        ? "bg-slate-900 text-purple-400 shadow-sm dark:bg-slate-950"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                )}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark</span>
            </Button>
        </div>
    );
}
