import { useState } from "react";
import { HelpCircle, X, MapPin, HardHat, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                onClick={() => setIsOpen(true)}
                title="Help & Guide"
            >
                <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border-0 shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                User Guide
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-y-auto p-0 scroll-smooth">
                            <div className="p-6 space-y-6">
                                {/* Intro */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Welcome to JanSeva</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Your all-in-one portal for reporting and resolving civic grievances.
                                        We connect citizens, field workers, and officers to fix city issues faster.
                                    </p>
                                </div>

                                {/* Citizens */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                                        <MapPin className="h-4 w-4" />
                                        <span>For Citizens</span>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 space-y-2 border border-blue-100 dark:border-blue-800">
                                        <ul className="list-disc list-inside space-y-1 ml-1">
                                            <li><span className="font-semibold">Report:</span> Use the <span className="font-mono text-xs bg-white dark:bg-slate-800 px-1 rounded">+</span> button to snap and submit issues.</li>
                                            <li><span className="font-semibold">Track:</span> See real-time status updates on your dashboard.</li>
                                            <li><span className="font-semibold">Verify:</span> Rate the quality of work once resolved.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Workers */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium text-sm">
                                        <HardHat className="h-4 w-4" />
                                        <span>For Field Workers</span>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 space-y-2 border border-amber-100 dark:border-amber-800">
                                        <ul className="list-disc list-inside space-y-1 ml-1">
                                            <li><span className="font-semibold">Tasks:</span> Check your assigned complaints daily.</li>
                                            <li><span className="font-semibold">Action:</span> Navigate to locations and fix the issue.</li>
                                            <li><span className="font-semibold">Proof:</span> Upload "Before" and "After" photos to finish jobs.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Officers */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>For Officers</span>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 space-y-2 border border-purple-100 dark:border-purple-800">
                                        <ul className="list-disc list-inside space-y-1 ml-1">
                                            <li><span className="font-semibold">Assign:</span> Delegate pending issues to available workers.</li>
                                            <li><span className="font-semibold">Verify:</span> Review photo evidence before closing complaints.</li>
                                            <li><span className="font-semibold">Monitor:</span> Watch for SLA breaches and delays.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Advanced */}
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-medium text-sm">
                                        <Zap className="h-4 w-4 text-yellow-500" />
                                        <span>Pro Tips</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        • Use the <strong>Map View</strong> to see issues near you.<br />
                                        • Enable <strong>Dark Mode</strong> in Profile &gt; Settings for night usage.<br />
                                        • Earn <strong>Impact Credits</strong> for every verified report!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
