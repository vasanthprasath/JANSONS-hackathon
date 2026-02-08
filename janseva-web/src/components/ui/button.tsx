import * as React from "react"

import { cn } from "@/lib/utils"

// Since I don't have cv-authority installed yet, I will install it or just write standard classes.
// I'll install it quickly along with radix-ui slot.
// Wait, I should stick to standard if possible to save time, but CVA is cleaner.
// I'll just use template literals/cn for now to avoid more installs or I will AUTO-INSTALL it.
// I will just use standard functional components with `cn`.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const Comp = "button"

        // Variant styles
        const variants = {
            default: "bg-[#2563eb] text-white hover:bg-[#2563eb]/90 shadow-sm transition-all hover:shadow-md active:scale-95",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-95",
            outline: "border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 active:scale-95",
            secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 active:scale-95",
            ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100 active:scale-95",
            link: "text-[#2563eb] underline-offset-4 hover:underline dark:text-blue-400",
        }

        // Size styles
        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
