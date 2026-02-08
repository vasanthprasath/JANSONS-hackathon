"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Complaint {
    id: string;
    description: string;
    resolutionTime?: number; // hours
    status: string;
    rating?: number;
}

interface AIInsightProps {
    resolvedComplaints: Complaint[];
}

export default function AIInsightPanel({ resolvedComplaints }: AIInsightProps) {
    // 1. Calculate Average Resolution Time
    const avgTime = resolvedComplaints.reduce((acc, curr) => acc + (curr.resolutionTime || 0), 0) / (resolvedComplaints.length || 1);

    // 2. Identify risks (e.g., low ratings or slow times)
    const riskCases = resolvedComplaints.filter(c => (c.resolutionTime && c.resolutionTime > 48) || (c.rating && c.rating < 3));

    // 3. Generate summary text (Mock NLP)
    const generateSummary = () => {
        if (resolvedComplaints.length === 0) return "Not enough data for AI analysis.";
        if (riskCases.length > 0) return `Detected ${riskCases.length} assignments requiring process review due to delays.`;
        return "Performance is optimal. Resolution times are within expected SLA.";
    };

    return (
        <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
            {/* Background decorative gradient */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

            <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-sm font-semibold tracking-wide">AI PERFORMANCE INSIGHTS</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-300">BETA</Badge>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="text-blue-400 font-semibold">Analysis: </span>
                        {generateSummary()}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 p-2 bg-slate-800/30 rounded">
                        <span className="text-[10px] text-slate-400 uppercase">Avg Resolution</span>
                        <div className="flex items-end gap-1">
                            <span className="text-xl font-bold text-white">{avgTime.toFixed(1)}h</span>
                            {resolvedComplaints.length > 0 && <span className="text-[10px] text-green-400 mb-1 flex items-center"><TrendingUp className="h-2 w-2 mr-0.5" /> Optimal</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 p-2 bg-slate-800/30 rounded">
                        <span className="text-[10px] text-slate-400 uppercase">Risk Level</span>
                        <div className="flex items-center gap-2 mt-1">
                            {riskCases.length > 1 ? (
                                <Badge className="bg-red-500/20 text-red-300 border-0 hover:bg-red-500/30">High</Badge>
                            ) : (
                                <Badge className="bg-green-500/20 text-green-300 border-0 hover:bg-green-500/30">Low</Badge>
                            )}
                        </div>
                    </div>
                </div>

                {resolvedComplaints.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/50">
                        <h4 className="text-[10px] font-semibold text-slate-400 mb-2 uppercase">Recent Patterns</h4>
                        <div className="space-y-2">
                            {riskCases.length > 0 ? (
                                <div className="flex items-center gap-2 text-xs text-amber-300">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Recurring delays detected in {riskCases.length} cases.</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    <span>No significant anomalies detected.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
